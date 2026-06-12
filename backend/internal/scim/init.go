package scim

import (
	"net/http"

	"github.com/thunder-id/thunderid/internal/entitytype"
	"github.com/thunder-id/thunderid/internal/system/config"
	"github.com/thunder-id/thunderid/internal/system/middleware"
	"github.com/thunder-id/thunderid/internal/user"
)

// Initialize sets up the SCIM module and registers all /scim/v2 routes.
func Initialize(
	mux *http.ServeMux,
	userService user.UserServiceInterface,
	entityTypeService entitytype.EntityTypeServiceInterface,
	baseURL string,
	scimCfg config.SCIMConfig,
) {
	svc := newSCIMService(userService, entityTypeService, scimCfg)
	h := newSCIMHandler(svc, baseURL)
	registerSCIMRoutes(mux, h)
}

// registerSCIMRoutes registers all /scim/v2 routes using the same
// middleware.WithCORS pattern as all other ThunderID modules.
func registerSCIMRoutes(mux *http.ServeMux, h *scimHandler) {
	optsGet := middleware.CORSOptions{
		AllowedMethods:   []string{"GET"},
		AllowedHeaders:   middleware.DefaultAllowedHeaders,
		AllowCredentials: true,
		MaxAge:           600,
	}

	// ServiceProviderConfig — Phase 1 implemented endpoint.
	mux.HandleFunc(middleware.WithCORS(
		"GET "+SCIMBasePath+"/ServiceProviderConfig",
		h.HandleServiceProviderConfigGetRequest,
		optsGet,
	))
	mux.HandleFunc(middleware.WithCORS(
		"OPTIONS "+SCIMBasePath+"/ServiceProviderConfig",
		func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusNoContent) },
		optsGet,
	))

	// Schemas — list all and get single by URN.
	mux.HandleFunc(middleware.WithCORS(
		"GET "+SCIMBasePath+"/Schemas",
		h.HandleSchemaListRequest,
		optsGet,
	))
	mux.HandleFunc(middleware.WithCORS(
		"OPTIONS "+SCIMBasePath+"/Schemas",
		func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusNoContent) },
		optsGet,
	))
	mux.HandleFunc(middleware.WithCORS(
		"GET "+SCIMBasePath+"/Schemas/{id}",
		h.HandleSchemaGetRequest,
		optsGet,
	))
	mux.HandleFunc(middleware.WithCORS(
		"OPTIONS "+SCIMBasePath+"/Schemas/{id}",
		func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusNoContent) },
		optsGet,
	))

	// ResourceTypes — list all and get single by ID.
	mux.HandleFunc(middleware.WithCORS(
		"GET "+SCIMBasePath+"/ResourceTypes",
		h.HandleResourceTypeListRequest,
		optsGet,
	))
	mux.HandleFunc(middleware.WithCORS(
		"OPTIONS "+SCIMBasePath+"/ResourceTypes",
		func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusNoContent) },
		optsGet,
	))
	mux.HandleFunc(middleware.WithCORS(
		"GET "+SCIMBasePath+"/ResourceTypes/{id}",
		h.HandleResourceTypeGetRequest,
		optsGet,
	))
	mux.HandleFunc(middleware.WithCORS(
		"OPTIONS "+SCIMBasePath+"/ResourceTypes/{id}",
		func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusNoContent) },
		optsGet,
	))

	// Unimplemented endpoints — return 501 per SCIM spec.
	for _, pattern := range []string{
		"GET " + SCIMBasePath + "/Users",
		"POST " + SCIMBasePath + "/Users",
		"PUT " + SCIMBasePath + "/Users",
		"DELETE " + SCIMBasePath + "/Users",
		"GET " + SCIMBasePath + "/Groups",
		"POST " + SCIMBasePath + "/Groups",
		"PUT " + SCIMBasePath + "/Groups",
		"DELETE " + SCIMBasePath + "/Groups",
		"POST " + SCIMBasePath + "/Bulk",
		"POST " + SCIMBasePath + "/.search",
	} {
		mux.HandleFunc(pattern, h.HandleUnsupportedRequest)
	}
}
