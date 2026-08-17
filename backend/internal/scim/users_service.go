// Copyright 2025-2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

package scim

import (
	"context"
	"encoding/json"
	"reflect"
	"strings"

	"github.com/thunder-id/thunderid/internal/entitytype"
	serverconst "github.com/thunder-id/thunderid/internal/system/constants"
	"github.com/thunder-id/thunderid/internal/system/log"
	"github.com/thunder-id/thunderid/internal/system/security"
	"github.com/thunder-id/thunderid/internal/user"
	tidcommon "github.com/thunder-id/thunderid/pkg/thunderidengine/common"
)

const usersServiceLoggerComponentName = "SCIMUsersService"

// SCIMUsersServiceInterface defines the Users CRUD operations exposed to the users handler.
type SCIMUsersServiceInterface interface {
	ListUsers(
		ctx context.Context, startIndex, count int,
		filters map[string]interface{}, baseURL string,
	) (SCIMUserListResponse, *tidcommon.ServiceError)
	CreateUser(
		ctx context.Context, payload *SCIMUserPayload, baseURL string,
	) (*SCIMUser, *tidcommon.ServiceError)
	GetUser(ctx context.Context, userID, baseURL string) (*SCIMUser, *tidcommon.ServiceError)
	ReplaceUser(
		ctx context.Context, userID string, payload *SCIMUserPayload, ifMatch, baseURL string,
	) (*SCIMUser, *tidcommon.ServiceError)
	DeleteUser(ctx context.Context, userID string, ifMatch string) *tidcommon.ServiceError
}

// scimUsersService implements SCIMUsersServiceInterface.
type scimUsersService struct {
	userService       user.UserServiceInterface
	entityTypeService entitytype.EntityTypeServiceInterface
}

// newSCIMUsersService creates a new scimUsersService.
func newSCIMUsersService(
	userService user.UserServiceInterface,
	entityTypeService entitytype.EntityTypeServiceInterface,
) SCIMUsersServiceInterface {
	return &scimUsersService{
		userService:       userService,
		entityTypeService: entityTypeService,
	}
}

// ListUsers retrieves a paginated list of SCIM User resources filtered by search criteria.
func (s *scimUsersService) ListUsers(ctx context.Context, startIndex, count int,
	filters map[string]interface{}, baseURL string) (SCIMUserListResponse, *tidcommon.ServiceError) {
	logger := log.GetLogger().With(log.String(log.LoggerKeyComponentName, usersServiceLoggerComponentName))

	if startIndex < 1 {
		startIndex = 1
	}
	if count < 1 {
		count = serverconst.DefaultPageSize
	}

	offset := startIndex - 1
	listResp, svcErr := s.userService.GetUserList(ctx, count, offset, filters, false)
	if svcErr != nil {
		logger.Error(ctx, "SCIM ListUsers: failed to get user list", log.Any("error", svcErr))
		return SCIMUserListResponse{}, mapUserServiceErrorToSCIM(svcErr)
	}
	scimUsers := make([]SCIMUser, 0, len(listResp.Users))
	credKeysByType := make(map[string]map[string]struct{})
	unresolvedTypes := make(map[string]struct{})
	for _, u := range listResp.Users {
		if _, unresolved := unresolvedTypes[u.Type]; unresolved {
			continue
		}
		credKeys, ok := credKeysByType[u.Type]
		if !ok {
			var svcErr *tidcommon.ServiceError
			credKeys, svcErr = s.getCredentialKeys(ctx, u.Type)
			if svcErr != nil {
				logger.Warn(ctx, "SCIM ListUsers: omitting user with unresolvable entity type",
					log.String("userID", u.ID), log.String("userType", u.Type))
				unresolvedTypes[u.Type] = struct{}{}
				continue
			}
			credKeysByType[u.Type] = credKeys
		}
		extensionURN := buildSchemaURN(u.Type)
		scimUsers = append(scimUsers, buildSCIMUserResource(ctx, u, extensionURN, baseURL, credKeys))
	}

	return buildSCIMUserListResponse(scimUsers, listResp.TotalResults, startIndex, len(scimUsers)), nil
}

// GetUser fetches a single user by ID and returns a SCIM User resource.
func (s *scimUsersService) GetUser(
	ctx context.Context, userID, baseURL string,
) (*SCIMUser, *tidcommon.ServiceError) {
	logger := log.GetLogger().With(log.String(log.LoggerKeyComponentName, usersServiceLoggerComponentName))

	u, svcErr := s.userService.GetUser(ctx, userID, false)
	if svcErr != nil {
		logger.Debug(ctx, "SCIM GetUser: user service error",
			log.String("userID", userID), log.Any("error", svcErr))
		return nil, mapUserServiceErrorToSCIM(svcErr)
	}

	extensionURN := buildSchemaURN(u.Type)
	credKeys, svcErr := s.getCredentialKeys(ctx, u.Type)
	if svcErr != nil {
		return nil, svcErr
	}
	scimUser := buildSCIMUserResource(ctx, *u, extensionURN, baseURL, credKeys)
	return &scimUser, nil
}

// CreateUser validates the entity type, then delegates to user.UserService.CreateUser.
func (s *scimUsersService) CreateUser(
	ctx context.Context, payload *SCIMUserPayload, baseURL string,
) (*SCIMUser, *tidcommon.ServiceError) {
	logger := log.GetLogger().With(log.String(log.LoggerKeyComponentName, usersServiceLoggerComponentName))

	runtimeCtx := security.WithRuntimeContext(ctx)
	var canonicalName string
	var svcErr *tidcommon.ServiceError
	if payload.UserTypeName == "" {
		canonicalName, svcErr = resolveDefaultEntityTypeName(runtimeCtx, s.entityTypeService)
		if svcErr != nil {
			logger.Error(ctx, "SCIM CreateUser: no default user type available", log.Any("error", svcErr))
			return nil, svcErr
		}
	} else {
		canonicalName, svcErr = resolveEntityTypeNameForSchemaURN(runtimeCtx, s.entityTypeService, payload.UserTypeName)
		if svcErr != nil || canonicalName == "" {
			logger.Error(ctx, "SCIM CreateUser: entity type not found",
				log.String("userTypeName", payload.UserTypeName), log.Any("error", svcErr))
			return nil, &ErrorUnknownUserType
		}
	}

	et, svcErr := s.entityTypeService.GetEntityTypeByName(runtimeCtx, entitytype.TypeCategoryUser, canonicalName)

	if svcErr != nil {
		logger.Error(ctx, "SCIM CreateUser: entity type not found",
			log.String("userTypeName", canonicalName), log.Any("error", svcErr))
		return nil, &ErrorUnknownUserType
	}

	if len(payload.CoreAttrs) > 0 {
		reverseMapped, err := reverseMapCoreAttrsForSchema(payload.CoreAttrs, et.Schema)
		if err != nil {
			logger.Error(ctx, "SCIM CreateUser: failed to parse entity type schema", log.Error(err))
			return nil, &ErrorInternalServer
		}
		if svcErr := mergeReverseMappedCoreAttrs(payload.ExtensionAttrs, reverseMapped); svcErr != nil {
			logger.Debug(ctx, "SCIM CreateUser: conflicting value between core and custom schema",
				log.Any("error", svcErr))
			return nil, svcErr
		}
	}
	missing, err := missingRequiredAttrs(payload.ExtensionAttrs, et.Schema, false)
	if err != nil {
		logger.Error(ctx, "SCIM CreateUser: failed to parse entity type schema", log.Error(err))
		return nil, &ErrorInternalServer
	}
	if len(missing) > 0 {
		logger.Debug(ctx, "SCIM CreateUser: missing required attributes for user type",
			log.String("userType", canonicalName), log.Any("missing", missing))
		return nil, newMissingRequiredAttributesError(canonicalName, missing)
	}
	undeclared, err := undeclaredAttrs(payload.ExtensionAttrs, et.Schema)
	if err != nil {
		logger.Error(ctx, "SCIM CreateUser: failed to parse entity type schema", log.Error(err))
		return nil, &ErrorInternalServer
	}
	if len(undeclared) > 0 {
		logger.Debug(ctx, "SCIM CreateUser: undeclared attributes for user type",
			log.String("userType", canonicalName), log.Any("undeclared", undeclared))
		return nil, newUndeclaredAttributesError(canonicalName, undeclared)
	}
	attrsJSON, err := json.Marshal(payload.ExtensionAttrs)
	if err != nil {
		logger.Error(ctx, "SCIM CreateUser: failed to marshal extension attrs", log.Error(err))
		return nil, &ErrorInvalidRequestBody
	}
	newUser := &user.User{
		OUID:       et.OUID,
		Type:       canonicalName,
		Attributes: attrsJSON,
	}

	created, svcErr := s.userService.CreateUser(ctx, newUser)
	if svcErr != nil {
		logger.Error(ctx, "SCIM CreateUser: user service error", log.Any("error", svcErr))
		return nil, mapUserServiceErrorToSCIM(svcErr)
	}
	extensionURN := buildSchemaURN(created.Type)
	credKeys, svcErr := s.getCredentialKeys(ctx, canonicalName)
	if svcErr != nil {
		return nil, svcErr
	}
	scimUser := buildSCIMUserResource(ctx, *created, extensionURN, baseURL, credKeys)
	return &scimUser, nil
}

// ReplaceUser performs a full PUT replace on the user.
func (s *scimUsersService) ReplaceUser(
	ctx context.Context, userID string, payload *SCIMUserPayload, ifMatch, baseURL string,
) (*SCIMUser, *tidcommon.ServiceError) {
	logger := log.GetLogger().With(log.String(log.LoggerKeyComponentName, usersServiceLoggerComponentName))

	runtimeCtx := security.WithRuntimeContext(ctx)

	existingUser, svcErr := s.userService.GetUser(ctx, userID, false)
	if svcErr != nil {
		logger.Debug(ctx, "SCIM ReplaceUser: user service error",
			log.String("userID", userID), log.Any("error", svcErr))
		return nil, mapUserServiceErrorToSCIM(svcErr)
	}

	if trimmed := strings.TrimSpace(ifMatch); trimmed != "" {
		if svcErr := checkIfMatch(trimmed, generateVersion(userVersionState(*existingUser))); svcErr != nil {
			return nil, svcErr
		}
	}

	// The user's type is immutable, so an omitted extension URN defaults to the
	// existing type rather than being treated as ambiguous. A supplied URN must
	// still match the existing type.
	canonicalName := existingUser.Type
	if payload.UserTypeName != "" {
		resolvedName, svcErr := resolveEntityTypeNameForSchemaURN(runtimeCtx, s.entityTypeService, payload.UserTypeName)
		if svcErr != nil || resolvedName == "" {
			logger.Error(runtimeCtx, "SCIM ReplaceUser: entity type not found",
				log.String("userTypeName", payload.UserTypeName), log.Any("error", svcErr))
			return nil, &ErrorUnknownUserType
		}
		if resolvedName != existingUser.Type {
			logger.Error(ctx, "SCIM ReplaceUser: user type mismatch",
				log.String("userID", userID), log.String("existingType", existingUser.Type),
				log.String("requestedType", resolvedName))
			return nil, &ErrorImmutableUserType
		}
	}

	et, svcErr := s.entityTypeService.GetEntityTypeByName(runtimeCtx, entitytype.TypeCategoryUser, canonicalName)
	if svcErr != nil {
		logger.Error(runtimeCtx, "SCIM ReplaceUser: entity type not found",
			log.String("userTypeName", canonicalName), log.Any("error", svcErr))
		return nil, &ErrorUnknownUserType
	}
	if len(payload.CoreAttrs) > 0 {
		reverseMapped, err := reverseMapCoreAttrsForSchema(payload.CoreAttrs, et.Schema)
		if err != nil {
			logger.Error(ctx, "SCIM ReplaceUser: failed to parse entity type schema", log.Error(err))
			return nil, &ErrorInternalServer
		}
		if svcErr := mergeReverseMappedCoreAttrs(payload.ExtensionAttrs, reverseMapped); svcErr != nil {
			logger.Debug(ctx, "SCIM ReplaceUser: conflicting value between core and custom schema",
				log.Any("error", svcErr))
			return nil, svcErr
		}
	}
	missing, err := missingRequiredAttrs(payload.ExtensionAttrs, et.Schema, true)
	if err != nil {
		logger.Error(ctx, "SCIM ReplaceUser: failed to parse entity type schema", log.Error(err))
		return nil, &ErrorInternalServer
	}
	if len(missing) > 0 {
		logger.Debug(ctx, "SCIM ReplaceUser: missing required attributes for user type",
			log.String("userType", canonicalName), log.Any("missing", missing))
		return nil, newMissingRequiredAttributesError(canonicalName, missing)
	}
	undeclared, err := undeclaredAttrs(payload.ExtensionAttrs, et.Schema)
	if err != nil {
		logger.Error(ctx, "SCIM ReplaceUser: failed to parse entity type schema", log.Error(err))
		return nil, &ErrorInternalServer
	}
	if len(undeclared) > 0 {
		logger.Debug(ctx, "SCIM ReplaceUser: undeclared attributes for user type",
			log.String("userType", canonicalName), log.Any("undeclared", undeclared))
		return nil, newUndeclaredAttributesError(canonicalName, undeclared)
	}
	attrsJSON, err := json.Marshal(payload.ExtensionAttrs)
	if err != nil {
		logger.Error(ctx, "SCIM ReplaceUser: failed to marshal extension attrs", log.Error(err))
		return nil, &ErrorInvalidRequestBody
	}
	updatedUser := &user.User{
		ID:         userID,
		OUID:       et.OUID,
		Type:       canonicalName,
		Attributes: attrsJSON,
	}
	result, svcErr := s.userService.UpdateUser(ctx, userID, updatedUser)
	if svcErr != nil {
		logger.Error(ctx, "SCIM ReplaceUser: user service error",
			log.String("userID", userID), log.Any("error", svcErr))
		return nil, mapUserServiceErrorToSCIM(svcErr)
	}

	extensionURN := buildSchemaURN(result.Type)
	credKeys, svcErr := s.getCredentialKeys(ctx, canonicalName)
	if svcErr != nil {
		return nil, svcErr
	}
	scimUser := buildSCIMUserResource(ctx, *result, extensionURN, baseURL, credKeys)
	return &scimUser, nil
}

// DeleteUser deletes a user by ID.
func (s *scimUsersService) DeleteUser(ctx context.Context, userID string, ifMatch string) *tidcommon.ServiceError {
	logger := log.GetLogger().With(log.String(log.LoggerKeyComponentName, usersServiceLoggerComponentName))

	if trimmed := strings.TrimSpace(ifMatch); trimmed != "" {
		existingUser, svcErr := s.userService.GetUser(ctx, userID, false)
		if svcErr != nil {
			logger.Error(ctx, "SCIM DeleteUser: user service error",
				log.String("userID", userID), log.Any("error", svcErr))
			return mapUserServiceErrorToSCIM(svcErr)
		}
		if svcErr := checkIfMatch(trimmed, generateVersion(userVersionState(*existingUser))); svcErr != nil {
			return svcErr
		}
	}

	svcErr := s.userService.DeleteUser(ctx, userID)
	if svcErr != nil {
		logger.Error(ctx, "SCIM DeleteUser: user service error",
			log.String("userID", userID), log.Any("error", svcErr))
		return mapUserServiceErrorToSCIM(svcErr)
	}
	return nil
}

// getCredentialKeys returns a set of attribute names that represent credentials for the given user type.
func (s *scimUsersService) getCredentialKeys(
	ctx context.Context, canonicalName string,
) (map[string]struct{}, *tidcommon.ServiceError) {
	logger := log.GetLogger().With(log.String(log.LoggerKeyComponentName, usersServiceLoggerComponentName))

	credKeys := make(map[string]struct{})
	// Use elevated runtime context if necessary, but we are just reading schema info.
	credentialInfos, err := s.entityTypeService.GetAttributes(security.WithRuntimeContext(ctx),
		entitytype.TypeCategoryUser, canonicalName, true, false, false)
	if err != nil {
		logger.Error(ctx, "SCIM: failed to resolve credential attribute keys",
			log.String("userType", canonicalName), log.Any("error", err))
		return nil, &ErrorInternalServer
	}
	for _, info := range credentialInfos {
		credKeys[info.Attribute] = struct{}{}
	}
	return credKeys, nil
}

// mergeReverseMappedCoreAttrs merges core-mapped attribute values (reverse-mapped from the
// top-level SCIM core fields) into the extension attrs map. If the same attribute is already
// present in the extension object with a different value, this is a conflicting-value error
// rather than a silent overwrite - the client supplied two different values for the same
// underlying attribute through the core and custom channels, and one of them would otherwise
// be silently discarded.
func mergeReverseMappedCoreAttrs(
	extensionAttrs map[string]json.RawMessage, reverseMapped map[string]json.RawMessage,
) *tidcommon.ServiceError {
	for k, v := range reverseMapped {
		existing, exists := extensionAttrs[k]
		if !exists {
			extensionAttrs[k] = v
			continue
		}
		if !jsonRawValuesEqual(existing, v) {
			return newConflictingAttributeValueError(k)
		}
	}
	return nil
}

// jsonRawValuesEqual reports whether two JSON-encoded values are semantically equal,
// regardless of formatting differences (whitespace, key order for objects). Falls back
// to a byte comparison if either value fails to unmarshal.
func jsonRawValuesEqual(a, b json.RawMessage) bool {
	var av, bv interface{}
	if err := json.Unmarshal(a, &av); err != nil {
		return string(a) == string(b)
	}
	if err := json.Unmarshal(b, &bv); err != nil {
		return string(a) == string(b)
	}
	return reflect.DeepEqual(av, bv)
}

// mapUserServiceErrorToSCIM translates a user service error into a SCIM package error.
func mapUserServiceErrorToSCIM(svcErr *tidcommon.ServiceError) *tidcommon.ServiceError {
	if svcErr == nil {
		return nil
	}
	switch svcErr.Code {
	case user.ErrorUserNotFound.Code:
		return &ErrorUserNotFound
	case user.ErrorAttributeConflict.Code:
		return &ErrorUniquenessConflict
	case user.ErrorSchemaValidationFailed.Code:
		return &ErrorSchemaValidationFailed
	case user.ErrorEntityTypeNotFound.Code:
		return &ErrorUnknownUserType
	case user.ErrorCannotModifyDeclarativeResource.Code:
		return &ErrorMutabilityViolation
	case tidcommon.ErrorUnauthorized.Code:
		return svcErr
	default:
		if svcErr.Type == tidcommon.ServerErrorType {
			return &tidcommon.InternalServerError
		}
		return &ErrorInvalidRequestBody
	}
}
