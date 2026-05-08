.PHONY: all clean lib cli site site-public test build run

BUILD_DIR        ?= build
PUBLIC_BUILD_DIR ?= build-public
SITE_SRC         := src/Ostranauts.Site
HANDOFF_SRC      := notes/handoff
USER_STORIES_SRC := notes/user-stories
BUILDER_PROJ     := src/Ostranauts.Site.Builder/Ostranauts.Site.Builder.csproj
LIB_PROJ         := src/Ostranauts.DataModel/Ostranauts.DataModel.csproj
TEST_PROJ        := tests/Ostranauts.DataModel.Tests/Ostranauts.DataModel.Tests.csproj
CONFIG           ?= Release

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
site: cli user-stories
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

# Build the site with every mod under spiffy-mods/<ModName>/data/ loaded as
# an additional root after vanilla data + comment_mod/data. Roots load in
# order, last-wins per strName -- so a mod can override a vanilla entry by
# redefining it. Use this to preview a mod's effect on the explorer; default
# `make site` stays vanilla-only.
site-mods: cli user-stories
	@mkdir -p $(BUILD_DIR)
	dotnet run --project $(BUILDER_PROJ) -c $(CONFIG) --no-build -- \
		$(foreach r,data comment_mod/data $(wildcard spiffy-mods/*/data),--root $(r)) \
		--out $(BUILD_DIR)/data
	cp -r $(SITE_SRC)/. $(BUILD_DIR)/
	@if [ -d "$(HANDOFF_SRC)" ]; then \
		mkdir -p $(BUILD_DIR)/handoff; \
		cp -r $(HANDOFF_SRC)/. $(BUILD_DIR)/handoff/; \
	fi
.PHONY: site-mods

# Render notes/user-stories/*.md into $(SITE_SRC)/user-stories/ (gitignored)
# so direct file:// preview of src/Ostranauts.Site/index.html resolves the
# User Stories tab card. The site/site-public targets' cp -r SITE_SRC/. step
# then picks the rendered HTML up automatically — single source of truth.
user-stories:
	@if [ -d "$(USER_STORIES_SRC)" ]; then \
		python utils/python/render_user_stories.py --in $(USER_STORIES_SRC) --out $(SITE_SRC)/user-stories; \
	fi
.PHONY: user-stories

build: site

# Public bundle: site frame + cover + handoffs + empty data stubs. No
# game-data derivatives, so this is what GitHub Pages publishes. The
# parser never runs here — the runner doesn't need .NET or the game tree.
# See CLAUDE.md "Pre-push check — four-factor fair use review" before
# adding anything new to this surface.
site-public: user-stories
	rm -rf $(PUBLIC_BUILD_DIR)
	mkdir -p $(PUBLIC_BUILD_DIR)/data
	cp -r $(SITE_SRC)/. $(PUBLIC_BUILD_DIR)/
	@echo 'window.GRAPH_DATA = { nodes: [], edges: [], rules: {}, _isPublicBundle: true };' > $(PUBLIC_BUILD_DIR)/data/graph.js
	@echo 'window.NODE_PROPS = {};' > $(PUBLIC_BUILD_DIR)/data/properties.js
	@echo 'window.CODE_REFS = {};' > $(PUBLIC_BUILD_DIR)/data/code_refs.js
	@echo 'window.REF_CANDIDATES = {};' > $(PUBLIC_BUILD_DIR)/data/ref_candidates.js
	@if [ -d "$(HANDOFF_SRC)" ]; then \
		mkdir -p $(PUBLIC_BUILD_DIR)/handoff; \
		cp -r $(HANDOFF_SRC)/. $(PUBLIC_BUILD_DIR)/handoff/; \
	fi

# Convenience: open the built site in the default browser (Windows / Git Bash).
run: site
	@start "" "$(BUILD_DIR)/index.html" || xdg-open "$(BUILD_DIR)/index.html" || open "$(BUILD_DIR)/index.html"

clean:
	rm -rf $(BUILD_DIR) $(PUBLIC_BUILD_DIR)
	dotnet clean -c $(CONFIG) --nologo
