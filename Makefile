TIMESTAMP_FILE := ./dist/timestamp # 兼容旧版更新逻辑
BUILD_INFO_JSON := ./dist/buildinfo.json
OUTPUT_FILE := ./dist/index.js
TEMP_FILE := ./dist/temp.js # 临时文件用于处理内容
ENTRY_FILE := main.js
ESLINT := ./node_modules/.bin/eslint
ESBUILD := ./node_modules/.bin/esbuild

.PHONY: build clean lint

build: clean
	@COMMIT_HASH=$$(git rev-parse --short HEAD) && \
	TIMESTAMP=$$(date +%s) && \
	echo "$$TIMESTAMP" > $(TIMESTAMP_FILE) && \
	echo "{\"sha\": \"$$COMMIT_HASH\", \"timestamp\": $$TIMESTAMP}" > $(BUILD_INFO_JSON) && \
	$(ESBUILD) $(ENTRY_FILE) --bundle --outfile=$(OUTPUT_FILE) --format=esm --define:process.env.BUILD_VERSION="'$$COMMIT_HASH'" --define:process.env.BUILD_TIMESTAMP="$$TIMESTAMP" && \
	echo "import { Buffer } from 'node:buffer';" > $(TEMP_FILE) && \
	cat $(OUTPUT_FILE) >> $(TEMP_FILE) && \
	mv $(TEMP_FILE) $(OUTPUT_FILE)

clean:
	rm -f $(TIMESTAMP_FILE) $(BUILD_INFO_JSON) $(OUTPUT_FILE) $(TEMP_FILE)

lint:
	$(ESLINT) --fix main.js src adapter
