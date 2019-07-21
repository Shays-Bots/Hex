import { parse, ParsedPath } from "path"

export function getPath(module: NodeModule): ParsedPath {
	delete require.cache[module.filename] // eslint-disable-line @typescript-eslint/no-dynamic-delete

	return parse(module.parent!.filename)
}
