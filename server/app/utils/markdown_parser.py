import re
from markdown_it import MarkdownIt

def parse_markdown(content: str):
    """
    Parses a markdown string, extracting YAML frontmatter, wikilinks, and plain text.
    """
    metadata = {}
    
    # 1. Extract YAML frontmatter
    frontmatter_match = re.match(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
    if frontmatter_match:
        frontmatter = frontmatter_match.group(1)
        # very basic yaml parsing
        for line in frontmatter.split("\n"):
            if ":" in line:
                key, val = line.split(":", 1)
                key = key.strip()
                val = val.strip()
                if val.startswith("[") and val.endswith("]"):
                    # list of tags
                    val = [v.strip() for v in val[1:-1].split(",") if v.strip()]
                metadata[key] = val
        content = content[frontmatter_match.end():] # remove frontmatter for plain text
    
    # 2. Extract and resolve wikilinks: [[link]]
    wikilinks = re.findall(r'\[\[(.*?)\]\]', content)
    
    # We will leave wikilinks in the text as is for context, 
    # but could also remove the brackets if we wanted.
    # For now, let's keep them so the LLM sees them.
    
    return {
        "metadata": metadata,
        "content": content,
        "wikilinks": wikilinks
    }
