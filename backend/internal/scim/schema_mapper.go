package scim

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/thunder-id/thunderid/internal/entitytype"
)

// rawPropertyDef mirrors the exact JSON structure that CompileSchema accepts.
// Fields match what compileProperty() in entitytype/model/schema.go reads.
// This is NOT a re-implementation — it reads the same stored JSON from EntityType.Schema
// and converts it to SCIM attributes without modifying any existing package.
type rawPropertyDef struct {
	Type        string                    `json:"type"`
	Required    bool                      `json:"required"`
	Unique      bool                      `json:"unique"`
	Credential  bool                      `json:"credential"`
	DisplayName string                    `json:"displayName"`
	Properties  map[string]rawPropertyDef `json:"properties"` // for type=object
	Items       *rawPropertyDef           `json:"items"`      // for type=array
}

// buildSchemaURN returns the canonical lowercase SCIM extension URN for a ThunderID user type.
// Format: urn:thunderid:params:scim:schemas:<userTypeName>:2.0:User
func buildSchemaURN(userTypeName string) string {
	return ThunderIDURNPrefix + strings.ToLower(userTypeName) + ThunderIDURNSuffix
}

// parseUserTypeFromSchemaURN extracts the user type name from a ThunderID extension URN.
// Matching is case-insensitive per the proposal decision.
// Returns the name and true on success; empty string and false if the URN is not a
// well-formed ThunderID extension URN.
func parseUserTypeFromSchemaURN(schemaURN string) (string, bool) {
	lower := strings.ToLower(strings.TrimSpace(schemaURN))

	lowerPrefix := strings.ToLower(ThunderIDURNPrefix)
	lowerSuffix := strings.ToLower(ThunderIDURNSuffix)

	// Must start with the ThunderID prefix.
	if !strings.HasPrefix(lower, lowerPrefix) {
		return "", false
	}

	// Strip the prefix first.
	withoutPrefix := lower[len(lowerPrefix):]

	// Must end with the ThunderID suffix.
	if !strings.HasSuffix(withoutPrefix, lowerSuffix) {
		return "", false
	}

	// Strip the suffix to get the user type name.
	name := strings.TrimSuffix(withoutPrefix, lowerSuffix)

	if name == "" {
		return "", false
	}

	return name, true
}

// mapEntityTypeToSCIMSchema converts a ThunderID EntityType into a SCIM Schema resource
// per RFC 7643 §7.

func mapEntityTypeToSCIMSchema(et entitytype.EntityType, baseURL string) (SCIMSchema, error) {
	schemaURN := buildSchemaURN(et.Name)
	location := fmt.Sprintf("%s%s/Schemas/%s", baseURL, SCIMBasePath, schemaURN)
	description := fmt.Sprintf("%s user type", et.Name)
	// Parse the raw schema JSON into our property def map.
	// This mirrors what CompileSchema does without calling into the model package.
	var rawProps map[string]rawPropertyDef
	if err := json.Unmarshal(et.Schema, &rawProps); err != nil {
		return SCIMSchema{}, fmt.Errorf("mapEntityTypeToSCIMSchema: failed to parse schema JSON for %q: %w", et.Name, err)
	}

	// Convert every property dynamically — no hardcoding, no length limit.
	attributes := make([]SCIMSchemaAttribute, 0, len(rawProps))
	for propName, propDef := range rawProps {
		attributes = append(attributes, mapRawPropertyToSCIMAttribute(propName, propDef))
	}

	return SCIMSchema{
		Schemas:     []string{SCIMSchemaSchemaURN},
		ID:          schemaURN,
		Name:        et.Name,
		Description: description,
		Attributes:  attributes,
		Meta: SCIMMeta{
			ResourceType: "Schema",
			Location:     location,
		},
	}, nil
}

// mapRawPropertyToSCIMAttribute recursively converts a single rawPropertyDef into a
// SCIMSchemaAttribute. Called for every top-level attribute and for each sub-attribute
// of object and array-of-object properties.
func mapRawPropertyToSCIMAttribute(name string, def rawPropertyDef) SCIMSchemaAttribute {
	attr := SCIMSchemaAttribute{
		Name:        name,
		Description: def.DisplayName,
		Required:    def.Required,
		CaseExact:   false,
		MultiValued: false,
		Mutability:  scimMutabilityReadWrite,
		Returned:    scimReturnedDefault,
		Uniqueness:  scimUniquenessNone,
	}

	// Credential fields must never be returned per RFC 7643 §7 and the proposal security constraints.
	if def.Credential {
		attr.Returned = scimReturnedNever
		attr.Mutability = scimMutabilityWriteOnly
		attr.CaseExact = true
	}

	if def.Unique {
		attr.Uniqueness = scimUniquenessServer
	}

	// Derive SCIM type and populate sub-attributes by switching on the ThunderID type string.
	switch strings.ToLower(def.Type) {
	case "string":
		attr.Type = scimAttrTypeString

	case "number":
		attr.Type = scimAttrTypeInteger

	case "boolean":
		attr.Type = scimAttrTypeBoolean

	case "object":
		// Complex type: recursively map every nested property as a sub-attribute.

		attr.Type = scimAttrTypeComplex
		if len(def.Properties) > 0 {
			subs := make([]SCIMSchemaAttribute, 0, len(def.Properties))
			for subName, subDef := range def.Properties {
				subs = append(subs, mapRawPropertyToSCIMAttribute(subName, subDef))
			}
			attr.SubAttributes = subs
		}

	case "array":
		// Multi-valued type: the SCIM type is derived from the items definition.
		attr.MultiValued = true
		if def.Items != nil {
			itemAttr := mapRawPropertyToSCIMAttribute(name, *def.Items)
			attr.Type = itemAttr.Type
			// Propagate sub-attributes when items are objects.
			if len(itemAttr.SubAttributes) > 0 {
				attr.SubAttributes = itemAttr.SubAttributes
			}
		} else {
			// Array without an items definition — default to string per RFC 7643 §2.3.
			attr.Type = scimAttrTypeString
		}

	default:
		// Unknown type: fall back to string. CompileSchema rejects unknown types at
		// write time, so this branch is a defensive guard for future type additions.
		attr.Type = scimAttrTypeString
	}

	return attr
}

// buildCoreUserSchema returns the static SCIM Core User schema (RFC 7643 §4.1).
func buildCoreUserSchema(baseURL string) SCIMSchema {
	location := fmt.Sprintf("%s%s/Schemas/%s", baseURL, SCIMBasePath, SCIMCoreUserSchemaURN)
	return SCIMSchema{
		Schemas:     []string{SCIMSchemaSchemaURN},
		ID:          SCIMCoreUserSchemaURN,
		Name:        "User",
		Description: "User Account",
		Attributes:  coreUserAttributes(),
		Meta: SCIMMeta{
			ResourceType: "Schema",
			Location:     location,
			Created:      scimCoreUserSchemaCreated,
			LastModified: scimCoreUserSchemaCreated,
		},
	}
}

// coreUserAttributes returns the minimal set of SCIM core User attributes per RFC 7643 §4.1.
// Kept separate from buildCoreUserSchema for readability and unit-testability.
func coreUserAttributes() []SCIMSchemaAttribute {
	return []SCIMSchemaAttribute{
		{
			Name:        "id",
			Type:        scimAttrTypeString,
			Description: "Unique identifier for the SCIM resource.",
			Required:    false,
			CaseExact:   true,
			Mutability:  scimMutabilityReadOnly,
			Returned:    scimReturnedAlways,
			Uniqueness:  scimUniquenessServer,
		},
	}
}
