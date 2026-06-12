package scim

const (
	loggerComponentName              = "SCIMhandler"
	scimServiceProviderConfigCreated = "2025-01-01T00:00:00Z"
	// SCIMBasePath is the base path for all SCIM v2 endpoints.
	SCIMBasePath = "/scim/v2"

	// SCIM core schema URNs.
	SCIMCoreUserSchemaURN              = "urn:ietf:params:scim:schemas:core:2.0:User"
	SCIMErrorSchemaURN                 = "urn:ietf:params:scim:api:messages:2.0:Error"
	SCIMListResponseSchemaURN          = "urn:ietf:params:scim:api:messages:2.0:ListResponse"
	SCIMServiceProviderConfigSchemaURN = "urn:ietf:params:scim:schemas:core:2.0:ServiceProviderConfig"
	SCIMResourceTypeSchemaURN          = "urn:ietf:params:scim:schemas:core:2.0:ResourceType"
	SCIMSchemaSchemaURN                = "urn:ietf:params:scim:schemas:core:2.0:Schema"

	// ThunderID custom URN parts.
	ThunderIDURNPrefix = "urn:thunderid:params:scim:schemas:"
	ThunderIDURNSuffix = ":2.0:User"

	// This resource is static and never mutated by operators.
	scimCoreUserSchemaCreated = "2025-01-01T00:00:00Z"

	// SCIM attribute type values (RFC 7643 §2.3).
	scimAttrTypeString  = "string"
	scimAttrTypeInteger = "integer"
	scimAttrTypeDecimal = "decimal"
	scimAttrTypeBoolean = "boolean"
	scimAttrTypeComplex = "complex"

	// SCIM attribute mutability values (RFC 7643 §2.2).
	scimMutabilityReadWrite = "readWrite"
	scimMutabilityReadOnly  = "readOnly"
	scimMutabilityImmutable = "immutable"
	scimMutabilityWriteOnly = "writeOnly"

	// SCIM attribute returned values (RFC 7643 §2.2).
	scimReturnedAlways  = "always"
	scimReturnedNever   = "never"
	scimReturnedDefault = "default"

	// SCIM attribute uniqueness values (RFC 7643 §2.2).
	scimUniquenessNone   = "none"
	scimUniquenessServer = "server"
	scimUniquenessGlobal = "global"

	// ResourceType constants for the User resource type.
	// ThunderID only exposes a single "User" resource type (RFC 7643 §6).
	scimResourceTypeUserID       = "User"
	scimResourceTypeUserName     = "User"
	scimResourceTypeUserEndpoint = "/Users"
	scimResourceTypeUserDesc     = "User Account"
)
