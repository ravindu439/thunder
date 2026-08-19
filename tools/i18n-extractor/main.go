// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

// i18n-extractor is a tool that scans Go source files for core.Message literals
// and generates a defaults.go file containing all extracted keys and their default values.
//
// Usage:
//
//	go run ./tools/i18n-extractor -source ./backend/internal -output ./backend/internal/system/i18n/core/defaults.go
package main

import (
	"flag"
	"fmt"
	"os"
	"strings"
)

func main() {
	sourceDirs := flag.String("source", "./internal", "Comma-separated source directories to scan for I18nMessage literals")
	outputFile := flag.String("output", "./internal/system/i18n/core/defaults.go", "Output file path for generated defaults")
	verbose := flag.Bool("verbose", false, "Enable verbose output")

	flag.Parse()

	if *verbose {
		fmt.Printf("Scanning directories: %s\n", *sourceDirs)
		fmt.Printf("Output file: %s\n", *outputFile)
	}

	dirs := strings.Split(*sourceDirs, ",")
	for i := range dirs {
		dirs[i] = strings.TrimSpace(dirs[i])
	}

	// Extract all I18nMessage literals from source files
	extractor := NewExtractor(*verbose)
	messages, err := extractor.ExtractFromDirectories(dirs)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error extracting messages: %v\n", err)
		os.Exit(1)
	}

	if *verbose {
		fmt.Printf("Found %d i18n messages\n", len(messages))
	}

	// Generate the defaults.go file
	generator := NewGenerator()
	err = generator.Generate(messages, *outputFile)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error generating output file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Successfully generated %s with %d messages\n", *outputFile, len(messages))
}
