.PHONY: all clean lib cli site test build run

DATA_ROOT     ?= data
BUILD_DIR     ?= build
SITE_SRC      := src/Ostranauts.Site
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

# Run the builder against $(DATA_ROOT), emit graph.json into $(BUILD_DIR)/data,
# then copy the static site files alongside it.
site: cli
	@mkdir -p $(BUILD_DIR)
	dotnet run --project $(BUILDER_PROJ) -c $(CONFIG) --no-build -- --data $(DATA_ROOT) --out $(BUILD_DIR)/data
	cp -r $(SITE_SRC)/. $(BUILD_DIR)/

build: site

# Convenience: open the built site in the default browser (Windows / Git Bash).
run: site
	@start "" "$(BUILD_DIR)/index.html" || xdg-open "$(BUILD_DIR)/index.html" || open "$(BUILD_DIR)/index.html"

clean:
	rm -rf $(BUILD_DIR)
	dotnet clean -c $(CONFIG) --nologo
