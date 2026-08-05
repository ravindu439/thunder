package scim

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	scimconfig "github.com/thunder-id/thunderid/internal/scim/config"
	serverconst "github.com/thunder-id/thunderid/internal/system/constants"
	"github.com/thunder-id/thunderid/internal/system/database/utils"
	"github.com/thunder-id/thunderid/internal/system/log"
	tidcommon "github.com/thunder-id/thunderid/pkg/thunderidengine/common"
)

const loggerComponentName = "scim"

var (
	scimFilterQuotedStringRe = regexp.MustCompile(`"([^"\\]|\\.)*"`)
	scimFilterEqRe           = regexp.MustCompile(`(?i)^((?:[A-Za-z0-9][A-Za-z0-9.\-_]*:)*)` +
		`([A-Za-z][A-Za-z0-9.\-_]*)\s+eq\s+(.+)$`)
)

// scimUsersHandler handles all /scim/v2/Users HTTP requests.
type scimUsersHandler struct {
	svc     SCIMUsersServiceInterface
	baseURL string
}

// newSCIMUsersHandler creates a new scimUsersHandler.
func newSCIMUsersHandler(svc SCIMUsersServiceInterface, baseURL string) *scimUsersHandler {
	return &scimUsersHandler{svc: svc, baseURL: baseURL}
}

// HandleUsersListRequest handles GET /scim/v2/Users
func (h *scimUsersHandler) HandleUsersListRequest(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	logger := log.GetLogger().With(log.String(log.LoggerKeyComponentName, loggerComponentName))

	if r.URL.Query().Get("sortBy") != "" || r.URL.Query().Get("sortOrder") != "" {
		h.handleSCIMError(w, r, &ErrorSortNotSupported)
		return
	}

	// Parse optional SCIM filter — only single "eq" expressions are supported.
	var parsedFilters map[string]interface{}
	if filterStr := r.URL.Query().Get("filter"); filterStr != "" {
		var err error
		parsedFilters, err = parseSCIMFilterForEq(filterStr)
		if err != nil {
			writeSCIMErrorResponse(ctx, w, http.StatusBadRequest, SCIMErrorResponse{
				Schemas:  []string{SCIMErrorSchemaURN},
				Status:   "400",
				ScimType: "invalidFilter",
				Detail:   err.Error(),
			})
			return
		}
	}
	startIndex := 1
	count := serverconst.DefaultPageSize

	if v := r.URL.Query().Get("startIndex"); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n > 0 {
			startIndex = n
		}
	}
	if v := r.URL.Query().Get("count"); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n > 0 {
			count = n
		}
	}
	if count > scimconfig.FilterMaxResults {
		count = scimconfig.FilterMaxResults
	}
	attributes := parseCSVQueryParam(r.URL.Query().Get("attributes"))
	excludedAttributes := parseCSVQueryParam(r.URL.Query().Get("excludedAttributes"))
	if svcErr := validateAttributesParams(attributes, excludedAttributes); svcErr != nil {
		h.handleSCIMError(w, r, svcErr)
		return
	}

	listResp, svcErr := h.svc.ListUsers(ctx, startIndex, count, parsedFilters, h.baseURL)
	if svcErr != nil {
		h.handleSCIMError(w, r, svcErr)
		return
	}

	h.writeUserListResponse(ctx, w, listResp, attributes, excludedAttributes)
	logger.Debug(ctx, "SCIM Users list sent", log.Int("totalResults", listResp.TotalResults))
}

// HandleUsersSearchRequest handles POST /scim/v2/Users/.search (RFC 7644 §3.4.3).
func (h *scimUsersHandler) HandleUsersSearchRequest(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	logger := log.GetLogger().With(log.String(log.LoggerKeyComponentName, loggerComponentName))

	if svcErr := validateSCIMContentType(r); svcErr != nil {
		h.handleSCIMError(w, r, svcErr)
		return
	}
	body, err := io.ReadAll(r.Body)
	if err != nil || len(body) == 0 {
		h.handleSCIMError(w, r, &ErrorInvalidRequestBody)
		return
	}
	var searchReq SCIMSearchRequest
	if err := json.Unmarshal(body, &searchReq); err != nil {
		h.handleSCIMError(w, r, &ErrorInvalidRequestBody)
		return
	}
	if searchReq.SortBy != "" || searchReq.SortOrder != "" {
		h.handleSCIMError(w, r, &ErrorSortNotSupported)
		return
	}
	hasSearchSchema := false
	for _, urn := range searchReq.Schemas {
		if strings.EqualFold(strings.TrimSpace(urn), SCIMSearchSchemaURN) {
			hasSearchSchema = true
			break
		}
	}
	if !hasSearchSchema {
		svcErr := ErrorMissingSchemas
		svcErr.ErrorDescription = tidcommon.I18nMessage{
			Key:          ErrorMissingSchemas.ErrorDescription.Key,
			DefaultValue: fmt.Sprintf("The schemas array must include %q", SCIMSearchSchemaURN),
		}
		h.handleSCIMError(w, r, &svcErr)
		return
	}
	if svcErr := validateAttributesParams(searchReq.Attributes, searchReq.ExcludedAttributes); svcErr != nil {
		h.handleSCIMError(w, r, svcErr)
		return
	}

	var parsedFilters map[string]interface{}
	if searchReq.Filter != "" {
		parsedFilters, err = parseSCIMFilterForEq(searchReq.Filter)
		if err != nil {
			writeSCIMErrorResponse(ctx, w, http.StatusBadRequest, SCIMErrorResponse{
				Schemas:  []string{SCIMErrorSchemaURN},
				Status:   "400",
				ScimType: "invalidFilter",
				Detail:   err.Error(),
			})
			return
		}
	}

	startIndex := searchReq.StartIndex
	if startIndex < 1 {
		startIndex = 1
	}
	count := searchReq.Count
	if count < 1 {
		count = serverconst.DefaultPageSize
	}
	if count > scimconfig.FilterMaxResults {
		count = scimconfig.FilterMaxResults
	}

	listResp, svcErr := h.svc.ListUsers(ctx, startIndex, count, parsedFilters, h.baseURL)
	if svcErr != nil {
		h.handleSCIMError(w, r, svcErr)
		return
	}

	h.writeUserListResponse(ctx, w, listResp, searchReq.Attributes, searchReq.ExcludedAttributes)
	logger.Debug(ctx, "SCIM Users search sent", log.Int("totalResults", listResp.TotalResults))
}

// HandleUsersCreateRequest handles POST /scim/v2/Users
func (h *scimUsersHandler) HandleUsersCreateRequest(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	logger := log.GetLogger().With(log.String(log.LoggerKeyComponentName, loggerComponentName))

	if svcErr := validateSCIMContentType(r); svcErr != nil {
		h.handleSCIMError(w, r, svcErr)
		return
	}
	body, err := io.ReadAll(r.Body)
	if err != nil || len(body) == 0 {
		h.handleSCIMError(w, r, &ErrorInvalidRequestBody)
		return
	}
	payload, svcErr := ValidateSCIMUserRequest(body)
	if svcErr != nil {
		h.handleSCIMError(w, r, svcErr)
		return
	}
	attributes := parseCSVQueryParam(r.URL.Query().Get("attributes"))
	excludedAttributes := parseCSVQueryParam(r.URL.Query().Get("excludedAttributes"))
	if svcErr := validateAttributesParams(attributes, excludedAttributes); svcErr != nil {
		h.handleSCIMError(w, r, svcErr)
		return
	}

	created, svcErr := h.svc.CreateUser(ctx, payload, h.baseURL)
	if svcErr != nil {
		h.handleSCIMError(w, r, svcErr)
		return
	}

	w.Header().Set("Location", created.Meta.Location)
	w.Header().Set("ETag", created.Meta.Version)
	h.writeUserResponse(ctx, w, http.StatusCreated, created, attributes, excludedAttributes)
	logger.Debug(ctx, "SCIM User created", log.String("userID", created.ID))
}

// HandleUsersGetRequest handles GET /scim/v2/Users/{id}
func (h *scimUsersHandler) HandleUsersGetRequest(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	logger := log.GetLogger().With(log.String(log.LoggerKeyComponentName, loggerComponentName))

	userID := r.PathValue("id")
	if userID == "" {
		h.handleSCIMError(w, r, &ErrorUserNotFound)
		return
	}
	attributes := parseCSVQueryParam(r.URL.Query().Get("attributes"))
	excludedAttributes := parseCSVQueryParam(r.URL.Query().Get("excludedAttributes"))
	if svcErr := validateAttributesParams(attributes, excludedAttributes); svcErr != nil {
		h.handleSCIMError(w, r, svcErr)
		return
	}
	scimUser, svcErr := h.svc.GetUser(ctx, userID, h.baseURL)
	if svcErr != nil {
		h.handleSCIMError(w, r, svcErr)
		return
	}
	w.Header().Set("ETag", scimUser.Meta.Version)
	h.writeUserResponse(ctx, w, http.StatusOK, scimUser, attributes, excludedAttributes)
	logger.Debug(ctx, "SCIM User GET sent", log.String("userID", userID))
}

// HandleUsersReplaceRequest handles PUT /scim/v2/Users/{id}
func (h *scimUsersHandler) HandleUsersReplaceRequest(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	logger := log.GetLogger().With(log.String(log.LoggerKeyComponentName, loggerComponentName))

	userID := r.PathValue("id")

	if userID == "" {
		h.handleSCIMError(w, r, &ErrorUserNotFound)
		return
	}
	if svcErr := validateSCIMContentType(r); svcErr != nil {
		h.handleSCIMError(w, r, svcErr)
		return
	}
	body, err := io.ReadAll(r.Body)
	if err != nil || len(body) == 0 {
		h.handleSCIMError(w, r, &ErrorInvalidRequestBody)
		return
	}
	payload, svcErr := ValidateSCIMUserRequest(body)
	if svcErr != nil {
		h.handleSCIMError(w, r, svcErr)
		return
	}
	attributes := parseCSVQueryParam(r.URL.Query().Get("attributes"))
	excludedAttributes := parseCSVQueryParam(r.URL.Query().Get("excludedAttributes"))
	if svcErr := validateAttributesParams(attributes, excludedAttributes); svcErr != nil {
		h.handleSCIMError(w, r, svcErr)
		return
	}

	replaced, svcErr := h.svc.ReplaceUser(ctx, userID, payload, r.Header.Get("If-Match"), h.baseURL)
	if svcErr != nil {
		h.handleSCIMError(w, r, svcErr)
		return
	}
	w.Header().Set("ETag", replaced.Meta.Version)
	h.writeUserResponse(ctx, w, http.StatusOK, replaced, attributes, excludedAttributes)
	logger.Debug(ctx, "SCIM User replaced", log.String("userID", userID))
}

// HandleUsersDeleteRequest handles DELETE /scim/v2/Users/{id}
func (h *scimUsersHandler) HandleUsersDeleteRequest(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	logger := log.GetLogger().With(log.String(log.LoggerKeyComponentName, loggerComponentName))

	userID := r.PathValue("id")
	if userID == "" {
		h.handleSCIMError(w, r, &ErrorUserNotFound)
		return
	}
	svcErr := h.svc.DeleteUser(ctx, userID, r.Header.Get("If-Match"))
	if svcErr != nil {
		h.handleSCIMError(w, r, svcErr)
		return
	}
	writeSCIMSuccessResponse(ctx, w, http.StatusNoContent, nil)
	logger.Debug(ctx, "SCIM User deleted", log.String("userID", userID))
}

// handleSCIMError translates an internal ThunderID ServiceError into the
// SCIM-standard wire error response (RFC 7644 §3.12).
func (h *scimUsersHandler) handleSCIMError(w http.ResponseWriter, r *http.Request, svcErr *tidcommon.ServiceError) {
	ctx := r.Context()

	if svcErr.Type == tidcommon.ServerErrorType {
		writeSCIMErrorResponse(ctx, w, http.StatusInternalServerError, SCIMErrorResponse{
			Schemas: []string{SCIMErrorSchemaURN},
			Status:  "500",
			Detail:  svcErr.ErrorDescription.DefaultValue,
		})
		return
	}

	httpStatus, scimType := mapSCIMError(svcErr)
	writeSCIMErrorResponse(ctx, w, httpStatus, SCIMErrorResponse{
		Schemas:  []string{SCIMErrorSchemaURN},
		Status:   fmt.Sprintf("%d", httpStatus),
		ScimType: scimType,
		Detail:   svcErr.ErrorDescription.DefaultValue,
	})
}

// validateAttributesParams enforces RFC 7644 §3.9: "attributes" and
// "excludedAttributes" are mutually exclusive.
func validateAttributesParams(attributes, excludedAttributes []string) *tidcommon.ServiceError {
	if len(attributes) > 0 && len(excludedAttributes) > 0 {
		return &ErrorConflictingAttributesParams
	}
	return nil
}

// writeProjectedResponse writes original, or projected in its place when
// attribute projection (RFC 7644 §3.9) actually pruned something. Shared by
// writeUserResponse and writeUserListResponse so the projection-error/write
// logic isn't duplicated for the single-resource and list-response cases.
func (h *scimUsersHandler) writeProjectedResponse(
	ctx context.Context, w http.ResponseWriter, status int,
	original interface{}, projected map[string]interface{}, err error,
) {
	if err != nil {
		log.GetLogger().Error(ctx, "SCIM attribute projection failed", log.Any("error", err))
		writeSCIMErrorResponse(ctx, w, http.StatusInternalServerError, SCIMErrorResponse{
			Schemas: []string{SCIMErrorSchemaURN},
			Status:  "500",
			Detail:  "failed to build response",
		})
		return
	}
	if projected != nil {
		writeSCIMSuccessResponse(ctx, w, status, projected)
		return
	}
	writeSCIMSuccessResponse(ctx, w, status, original)
}

// writeUserResponse writes a single SCIM User resource, applying attribute
// projection (RFC 7644 §3.9) when attributes/excludedAttributes were requested.
func (h *scimUsersHandler) writeUserResponse(
	ctx context.Context, w http.ResponseWriter, status int, scimUser *SCIMUser,
	attributes, excludedAttributes []string,
) {
	projected, err := projectSCIMUserResource(*scimUser, attributes, excludedAttributes)
	h.writeProjectedResponse(ctx, w, status, scimUser, projected, err)
}

// writeUserListResponse writes listResp, applying attribute projection
// (RFC 7644 §3.9) when attributes/excludedAttributes were requested.
func (h *scimUsersHandler) writeUserListResponse(
	ctx context.Context, w http.ResponseWriter, listResp SCIMUserListResponse,
	attributes, excludedAttributes []string,
) {
	projected, err := projectSCIMUserListResponse(listResp, attributes, excludedAttributes)
	h.writeProjectedResponse(ctx, w, http.StatusOK, listResp, projected, err)
}

// parseSCIMFilterForEq parses a SCIM filter string that contains exactly one
// "eq" comparison and no logical operators, grouping, or square brackets.
// Returns a native filter map suitable for userService.GetUserList, or an
// error if the expression uses any unsupported syntax.
func parseSCIMFilterForEq(filterStr string) (map[string]interface{}, error) {
	filterStr = strings.TrimSpace(filterStr)
	if filterStr == "" {
		return nil, nil
	}
	sanitized := scimFilterQuotedStringRe.ReplaceAllString(filterStr, `""`)
	lower := strings.ToLower(sanitized)
	// Reject all compound/complex expressions up front (outside of quoted strings).
	if strings.Contains(lower, " and ") ||
		strings.Contains(lower, " or ") ||
		strings.HasPrefix(lower, "not ") ||
		strings.ContainsAny(sanitized, "()[]") {
		return nil, fmt.Errorf(
			"compound filter expressions are not supported; only a single 'eq' expression is supported",
		)
	}
	// Reject any operator that is not "eq".
	// These keywords may appear as part of an unsupported operator.
	unsupportedOps := []string{" ne ", " co ", " sw ", " ew ", " pr", " gt ", " lt ", " ge ", " le "}
	for _, op := range unsupportedOps {
		if strings.Contains(lower, op) {
			// Extract the actual operator token for the error message.
			return nil, fmt.Errorf(
				"the specified filter operator is not supported; only 'eq' is supported",
			)
		}
	}
	// Match: [optional-URN-prefix:]attrPath eq compValue
	// attrPath allows alphanumeric, underscore, hyphen, and dot (for sub-attributes).
	// compValue is a quoted string, a boolean literal, or a number.
	matches := scimFilterEqRe.FindStringSubmatch(filterStr)
	if len(matches) == 0 {
		return nil, fmt.Errorf(
			"invalid filter expression; expected format: 'attrPath eq value'",
		)
	}
	// matches[1] = optional URN prefix (e.g. "urn:thunderid:params:scim:schemas:employee:2.0:User:")
	// matches[2] = attribute path (e.g. "profile.manager.id")
	// matches[3] = raw comparison value
	if isUnsupportedSCIMFilterAttr(matches[2]) {
		return nil, fmt.Errorf("filtering on %q is not supported", matches[2])
	}
	attribute := translateSCIMFilterAttr(matches[2])
	if err := utils.ValidateKey(attribute); err != nil {
		return nil, fmt.Errorf("filtering on %q is not supported", matches[2])
	}
	rawValue := strings.TrimSpace(matches[3])
	value, err := parseSCIMCompValue(rawValue)
	if err != nil {
		return nil, err
	}
	return map[string]interface{}{attribute: value}, nil
}

// parseSCIMCompValue converts a raw SCIM compValue token into a typed Go value.
// compValue = false / null / true / number / string  (RFC 7159 JSON rules)
func parseSCIMCompValue(raw string) (interface{}, error) {
	// Quoted string — parse as a JSON string literal so escapes are handled correctly.
	if len(raw) > 0 && raw[0] == '"' {
		s, err := strconv.Unquote(raw)
		if err == nil {
			return s, nil
		}
		return nil, fmt.Errorf("invalid quoted string comparison value: %q", raw)
	}
	lower := strings.ToLower(raw)
	switch lower {
	case "true":
		return true, nil
	case "false":
		return false, nil
	case "null":
		// null comparisons are not meaningful for our store.
		return nil, fmt.Errorf("null comparison values are not supported")
	}
	// Integer
	if intVal, err := strconv.ParseInt(raw, 10, 64); err == nil {
		return intVal, nil
	}
	// Decimal
	if floatVal, err := strconv.ParseFloat(raw, 64); err == nil {
		return floatVal, nil
	}
	return nil, fmt.Errorf("unrecognized comparison value: %q", raw)
}

// parseCSVQueryParam splits a comma-separated query value into trimmed,
// non-empty entries.
func parseCSVQueryParam(rawValue string) []string {
	if rawValue == "" {
		return nil
	}
	parts := strings.Split(rawValue, ",")
	result := make([]string, 0, len(parts))
	for _, part := range parts {
		if part = strings.TrimSpace(part); part != "" {
			result = append(result, part)
		}
	}
	return result
}
