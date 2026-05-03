.PHONY: all clean lib cli site test build run

BUILD_DIR     ?= build
SITE_SRC      := src/Ostranauts.Site
HANDOFF_SRC   := notes/handoff
BUILDER_PROJ  := src/Ostranauts.Site.Builder/Ostranauts.Site.Builder.csproj
LIB_PROJ      := src/Ostranauts.DataModel/Ostranauts.DataModel.csproj
TEST_PROJ     := tests/Ostranauts.DataModel.Tests/Ostranauts.DataModel.Tests.csproj
CONFIG        ?= Release

all: site

lib:
	dotnet build $(LIB_PROJ) -c $(CONFIG) --nologo

cli: lib
	dotnet build $(BUILDER_PROJ) -c $(CONFIG) --nologo

test:
	dotnet test $(TEST_PROJ) -c $(CONFIG) --nologo

# Run the builder, emit graph.js + properties.js + ref_candidates.js into
# $(BUILD_DIR)/data, then copy the static site files alongside them, then
# copy any standalone handoff pages from notes/handoff/ into build/handoff/
# so they deploy with the site (directly linkable; not navigable from the UI).
# The Builder auto-detects ./data and ./comment_mod/data when no --root
# flag is passed; override DATA_ROOT to point at a single specific root.
site: cli
	@mkdir -p $(BUILD_DIR)
ifdef DATA_ROOT
	dotnet run --project $(BUILDER_PROJ) -c $(CONFIG) --no-build -- --root $(DATA_ROOT) --out $(BUILD_DIR)/data
else
	dotnet run --project $(BUILDER_PROJ) -c $(CONFIG) --no-build -- --out $(BUILD_DIR)/data
endif
	cp -r $(SITE_SRC)/. $(BUILD_DIR)/
	@if [ -d "$(HANDOFF_SRC)" ]; then \
		mkdir -p $(BUILD_DIR)/handoff; \
		cp -r $(HANDOFF_SRC)/. $(BUILD_DIR)/handoff/; \
	fi

build: site

# Convenience: open the built site in the default browser (Windows / Git Bash).
run: site
	@start "" "$(BUILD_DIR)/index.html" || xdg-open "$(BUILD_DIR)/index.html" || open "$(BUILD_DIR)/index.html"

clean:
	rm -rf $(BUILD_DIR)
	dotnet clean -c $(CONFIG) --nologo
