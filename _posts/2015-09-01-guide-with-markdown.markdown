---
layout:     post
title:      "用户手册markdown示例"
subtitle:   "Write with markdown"
date:       2016-01-01 10:18:56
author:     "CaoZhiLong"
header-img: "img/post-bg-write-with-markdown.jpg"
tags:
    - markdown
---


% Pandoc User's Guide
% John MacFarlane
% January 29, 2017

Synopsis
========

`pandoc` [*options*] [*input-file*]...

Description
===========

Pandoc is a [Haskell] library for converting from one markup format to
another, and a command-line tool that uses this library. It can read
[Markdown], [CommonMark], [PHP Markdown Extra], [GitHub-Flavored Markdown],
[MultiMarkdown], and (subsets of) [Textile], [reStructuredText], [HTML],
[LaTeX], [MediaWiki markup], [TWiki markup], [Haddock markup], [OPML], [Emacs
Org mode], [DocBook], [txt2tags], [EPUB], [ODT] and [Word docx]; and it can
write plain text, [Markdown], [CommonMark], [PHP Markdown Extra],
[GitHub-Flavored Markdown], [MultiMarkdown], [reStructuredText], [XHTML],
[HTML5], [LaTeX] \(including [`beamer`] slide shows\), [ConTeXt], [RTF], [OPML],
[DocBook], [OpenDocument], [ODT], [Word docx], [GNU Texinfo], [MediaWiki
markup], [DokuWiki markup], [ZimWiki markup], [Haddock markup],
[EPUB] \(v2 or v3\), [FictionBook2], [Textile], [groff man] pages,
[Emacs Org mode], [AsciiDoc], [InDesign ICML], [TEI Simple], and [Slidy],
[Slideous], [DZSlides], [reveal.js] or [S5] HTML slide shows. It can also
produce [PDF] output on systems where LaTeX, ConTeXt, or `wkhtmltopdf` is
installed.

Pandoc's enhanced version of Markdown includes syntax for [footnotes],
[tables], flexible [ordered lists], [definition lists], [fenced code blocks],
[superscripts and subscripts], [strikeout], [metadata blocks], automatic tables of
contents, embedded LaTeX [math], [citations], and [Markdown inside HTML block
elements][Extension: `markdown_in_html_blocks`]. (These enhancements, described
further under [Pandoc's Markdown], can be disabled using the
`markdown_strict` input or output format.)

In contrast to most existing tools for converting Markdown to HTML, which
use regex substitutions, pandoc has a modular design: it consists of a
set of readers, which parse text in a given format and produce a native
representation of the document, and a set of writers, which convert
this native representation into a target format. Thus, adding an input
or output format requires only adding a reader or writer.

Because pandoc's intermediate representation of a document is less
expressive than many of the formats it converts between, one should
not expect perfect conversions between every format and every other.
Pandoc attempts to preserve the structural elements of a document, but
not formatting details such as margin size.  And some document elements,
such as complex tables, may not fit into pandoc's simple document
model.  While conversions from pandoc's Markdown to all formats aspire
to be perfect, conversions from formats more expressive than pandoc's
Markdown can be expected to be lossy.

[Markdown]: http://daringfireball.net/projects/markdown/
[CommonMark]: http://commonmark.org
[PHP Markdown Extra]: https://michelf.ca/projects/php-markdown/extra/
[GitHub-Flavored Markdown]: https://help.github.com/articles/github-flavored-markdown/
[MultiMarkdown]: http://fletcherpenney.net/multimarkdown/
[reStructuredText]: http://docutils.sourceforge.net/docs/ref/rst/introduction.html
[S5]: http://meyerweb.com/eric/tools/s5/
[Slidy]: http://www.w3.org/Talks/Tools/Slidy/
[Slideous]: http://goessner.net/articles/slideous/
[HTML]: http://www.w3.org/html/
[HTML5]: http://www.w3.org/TR/html5/
[XHTML]: http://www.w3.org/TR/xhtml1/
[LaTeX]: http://latex-project.org
[`beamer`]: https://ctan.org/pkg/beamer
[Beamer User's Guide]: http://ctan.math.utah.edu/ctan/tex-archive/macros/latex/contrib/beamer/doc/beameruserguide.pdf
[ConTeXt]: http://www.contextgarden.net/
[RTF]: http://en.wikipedia.org/wiki/Rich_Text_Format
[DocBook]: http://docbook.org
[txt2tags]: http://txt2tags.org
[EPUB]: http://idpf.org/epub
[OPML]: http://dev.opml.org/spec2.html
[OpenDocument]: http://opendocument.xml.org
[ODT]: http://en.wikipedia.org/wiki/OpenDocument
[Textile]: http://redcloth.org/textile
[MediaWiki markup]: https://www.mediawiki.org/wiki/Help:Formatting
[DokuWiki markup]: https://www.dokuwiki.org/dokuwiki
[ZimWiki markup]: http://zim-wiki.org/manual/Help/Wiki_Syntax.html
[TWiki markup]: http://twiki.org/cgi-bin/view/TWiki/TextFormattingRules
[Haddock markup]: https://www.haskell.org/haddock/doc/html/ch03s08.html
[groff man]: http://man7.org/linux/man-pages/man7/groff_man.7.html
[Haskell]: https://www.haskell.org
[GNU Texinfo]: http://www.gnu.org/software/texinfo/
[Emacs Org mode]: http://orgmode.org
[AsciiDoc]: http://www.methods.co.nz/asciidoc/
[DZSlides]: http://paulrouget.com/dzslides/
[Word docx]: https://en.wikipedia.org/wiki/Office_Open_XML
[PDF]: https://www.adobe.com/pdf/
[reveal.js]: http://lab.hakim.se/reveal-js/
[FictionBook2]: http://www.fictionbook.org/index.php/Eng:XML_Schema_Fictionbook_2.1
[InDesign ICML]: https://www.adobe.com/content/dam/Adobe/en/devnet/indesign/cs55-docs/IDML/idml-specification.pdf
[TEI Simple]: https://github.com/TEIC/TEI-Simple

Using `pandoc`
--------------

If no *input-file* is specified, input is read from *stdin*.
Otherwise, the *input-files* are concatenated (with a blank
line between each) and used as input.  Output goes to *stdout* by
default (though output to *stdout* is disabled for the `odt`, `docx`,
`epub`, and `epub3` output formats).  For output to a file, use the
`-o` option:

    pandoc -o output.html input.txt

By default, pandoc produces a document fragment, not a standalone
document with a proper header and footer.  To produce a standalone
document, use the `-s` or `--standalone` flag:

    pandoc -s -o output.html input.txt

For more information on how standalone documents are produced, see
[Templates], below.

Instead of a file, an absolute URI may be given.  In this case
pandoc will fetch the content using HTTP:

    pandoc -f html -t markdown http://www.fsf.org

If multiple input files are given, `pandoc` will concatenate them all (with
blank lines between them) before parsing. This feature is disabled for
 binary input formats such as `EPUB`, `odt`, and `docx`.

The format of the input and output can be specified explicitly using
command-line options.  The input format can be specified using the
`-r/--read` or `-f/--from` options, the output format using the
`-w/--write` or `-t/--to` options.  Thus, to convert `hello.txt` from
Markdown to LaTeX, you could type:

    pandoc -f markdown -t latex hello.txt

To convert `hello.html` from HTML to Markdown:

    pandoc -f html -t markdown hello.html

Supported output formats are listed below under the `-t/--to` option.
Supported input formats are listed below under the `-f/--from` option. Note
that the `rst`, `textile`, `latex`, and `html` readers are not complete;
there are some constructs that they do not parse.

If the input or output format is not specified explicitly, `pandoc`
will attempt to guess it from the extensions of
the input and output filenames.  Thus, for example,

    pandoc -o hello.tex hello.txt

will convert `hello.txt` from Markdown to LaTeX.  If no output file
is specified (so that output goes to *stdout*), or if the output file's
extension is unknown, the output format will default to HTML.
If no input file is specified (so that input comes from *stdin*), or
if the input files' extensions are unknown, the input format will
be assumed to be Markdown unless explicitly specified.

Pandoc uses the UTF-8 character encoding for both input and output.
If your local character encoding is not UTF-8, you
should pipe input and output through [`iconv`]:

    iconv -t utf-8 input.txt | pandoc | iconv -f utf-8

Note that in some output formats (such as HTML, LaTeX, ConTeXt,
RTF, OPML, DocBook, and Texinfo), information about
the character encoding is included in the document header, which
will only be included if you use the `-s/--standalone` option.

[`iconv`]: http://www.gnu.org/software/libiconv/

Creating a PDF
--------------

To produce a PDF, specify an output file with a `.pdf` extension.
By default, pandoc will use LaTeX to convert it to PDF:

    pandoc test.txt -o test.pdf

Production of a PDF requires that a LaTeX engine be installed (see
`--latex-engine`, below), and assumes that the following LaTeX packages
are available: [`amsfonts`], [`amsmath`], [`lm`],
[`ifxetex`], [`ifluatex`], [`eurosym`], [`listings`] (if the
`--listings` option is used), [`fancyvrb`], [`longtable`],
[`booktabs`], [`graphicx`] and [`grffile`] (if the
document contains images), [`hyperref`], [`ulem`],
[`geometry`] (with the `geometry` variable set), [`setspace`] (with
`linestretch`), and [`babel`] (with `lang`). The use of `xelatex` or
`lualatex` as the LaTeX engine requires [`fontspec`]; `xelatex` uses
[`mathspec`], [`polyglossia`] (with `lang`), [`xecjk`], and
[`bidi`] (with the `dir` variable set). The [`upquote`] and
[`microtype`] packages are used if available, and [`csquotes`] will
be used for [smart punctuation] if added to the template or included in
any header file. The [`natbib`], [`biblatex`], [`bibtex`], and [`biber`]
packages can optionally be used for [citation rendering]. These are
included with all recent versions of [TeX Live].

Alternatively, pandoc can use ConTeXt or `wkhtmltopdf` to create a PDF.
To do this, specify an output file with a `.pdf` extension,
as before, but add `-t context` or `-t html5` to the command line.

PDF output can be controlled using [variables for LaTeX] (if
LaTeX is used) and [variables for ConTeXt] (if ConTeXt is used).
If `wkhtmltopdf` is used, then the variables `margin-left`,
`margin-right`, `margin-top`, `margin-bottom`, and `papersize`
will affect the output, as will `--css`.

[`amsfonts`]: https://ctan.org/pkg/amsfonts
[`amsmath`]: https://ctan.org/pkg/amsmath
[`lm`]: https://ctan.org/pkg/lm
[`ifxetex`]: https://ctan.org/pkg/ifxetex
[`ifluatex`]: https://ctan.org/pkg/ifluatex
[`eurosym`]: https://ctan.org/pkg/eurosym
[`listings`]: https://ctan.org/pkg/listings
[`fancyvrb`]: https://ctan.org/pkg/fancyvrb
[`longtable`]: https://ctan.org/pkg/longtable
[`booktabs`]: https://ctan.org/pkg/booktabs
[`graphicx`]: https://ctan.org/pkg/graphicx
[`grffile`]: https://ctan.org/pkg/grffile
[`geometry`]: https://ctan.org/pkg/geometry
[`setspace`]: https://ctan.org/pkg/setspace
[`xecjk`]: https://ctan.org/pkg/xecjk
[`hyperref`]: https://ctan.org/pkg/hyperref
[`ulem`]: https://ctan.org/pkg/ulem
[`babel`]: https://ctan.org/pkg/babel
[`bidi`]: https://ctan.org/pkg/bidi
[`mathspec`]: https://ctan.org/pkg/mathspec
[`polyglossia`]: https://ctan.org/pkg/polyglossia
[`fontspec`]: https://ctan.org/pkg/fontspec
[`upquote`]: https://ctan.org/pkg/upquote
[`microtype`]: https://ctan.org/pkg/microtype
[`csquotes`]: https://ctan.org/pkg/csquotes
[`natbib`]: https://ctan.org/pkg/natbib
[`biblatex`]: https://ctan.org/pkg/biblatex
[`bibtex`]: https://ctan.org/pkg/bibtex
[`biber`]: https://ctan.org/pkg/biber
[TeX Live]: http://www.tug.org/texlive/

Options
=======

General options
---------------

`-f` *FORMAT*, `-r` *FORMAT*, `--from=`*FORMAT*, `--read=`*FORMAT*

:   Specify input format.  *FORMAT* can be `native` (native Haskell),
    `json` (JSON version of native AST), `markdown` (pandoc's
    extended Markdown), `markdown_strict` (original unextended
    Markdown), `markdown_phpextra` (PHP Markdown Extra), `markdown_github`
    (GitHub-Flavored Markdown), `markdown_mmd` (MultiMarkdown),
    `commonmark` (CommonMark Markdown), `textile` (Textile), `rst`
    (reStructuredText), `html` (HTML), `docbook` (DocBook), `t2t`
    (txt2tags), `docx` (docx), `odt` (ODT), `epub` (EPUB), `opml` (OPML),
    `org` (Emacs Org mode), `mediawiki` (MediaWiki markup), `twiki` (TWiki
    markup), `haddock` (Haddock markup), or `latex` (LaTeX).  If
    `+lhs` is appended to `markdown`, `rst`, `latex`, or `html`, the
    input will be treated as literate Haskell source: see [Literate
    Haskell support], below. Markdown
    syntax extensions can be individually enabled or disabled by
    appending `+EXTENSION` or `-EXTENSION` to the format name. So, for
    example, `markdown_strict+footnotes+definition_lists` is strict
    Markdown with footnotes and definition lists enabled, and
    `markdown-pipe_tables+hard_line_breaks` is pandoc's Markdown
    without pipe tables and with hard line breaks. See [Pandoc's
    Markdown], below, for a list of extensions and
    their names.  See `--list-input-formats` and `--list-extensions`,
    below.

`-t` *FORMAT*, `-w` *FORMAT*, `--to=`*FORMAT*, `--write=`*FORMAT*

:   Specify output format.  *FORMAT* can be `native` (native Haskell),
    `json` (JSON version of native AST), `plain` (plain text),
    `markdown` (pandoc's extended Markdown), `markdown_strict`
    (original unextended Markdown), `markdown_phpextra` (PHP Markdown
    Extra), `markdown_github` (GitHub-Flavored Markdown), `markdown_mmd`
    (MultiMarkdown), `commonmark` (CommonMark Markdown), `rst`
    (reStructuredText), `html` (XHTML), `html5` (HTML5), `latex`
    (LaTeX), `beamer` (LaTeX beamer slide show), `context` (ConTeXt),
    `man` (groff man), `mediawiki` (MediaWiki markup),
    `dokuwiki` (DokuWiki markup), `zimwiki` (ZimWiki markup),
    `textile` (Textile), `org` (Emacs Org mode),
    `texinfo` (GNU Texinfo), `opml` (OPML), `docbook` (DocBook 4),
    `docbook5` (DocBook 5), `opendocument` (OpenDocument), `odt`
    (OpenOffice text document), `docx` (Word docx), `haddock`
    (Haddock markup), `rtf` (rich text format), `epub` (EPUB v2
    book), `epub3` (EPUB v3), `fb2` (FictionBook2 e-book),
    `asciidoc` (AsciiDoc), `icml` (InDesign ICML), `tei` (TEI
    Simple), `slidy` (Slidy HTML and JavaScript slide show),
    `slideous` (Slideous HTML and JavaScript slide show),
    `dzslides` (DZSlides HTML5 + JavaScript slide show),
    `revealjs` (reveal.js HTML5 + JavaScript slide show), `s5`
    (S5 HTML and JavaScript slide show), or the path of a custom
    lua writer (see [Custom writers], below). Note that `odt`,
    `epub`, and `epub3` output will not be directed to *stdout*;
    an output filename must be specified using the `-o/--output`
    option. If `+lhs` is appended to `markdown`, `rst`, `latex`,
    `beamer`, `html`, or `html5`, the output will be rendered as
    literate Haskell source: see [Literate Haskell support],
    below.  Markdown syntax extensions can be individually
    enabled or disabled by appending `+EXTENSION` or
    `-EXTENSION` to the format name, as described above under `-f`.
    See `--list-output-formats` and `--list-extensions`, below.

`-o` *FILE*, `--output=`*FILE*

:   Write output to *FILE* instead of *stdout*.  If *FILE* is
    `-`, output will go to *stdout*.  (Exception: if the output
    format is `odt`, `docx`, `epub`, or `epub3`, output to stdout is disabled.)

`--data-dir=`*DIRECTORY*

:   Specify the user data directory to search for pandoc data files.
    If this option is not specified, the default user data directory
    will be used.  This is, in Unix:

        $HOME/.pandoc

    in Windows XP:

        C:\Documents And Settings\USERNAME\Application Data\pandoc

    and in Windows Vista or later:

        C:\Users\USERNAME\AppData\Roaming\pandoc

    You can find the default user data directory on your system by
    looking at the output of `pandoc --version`.
    A `reference.odt`, `reference.docx`, `epub.css`, `templates`,
    `slidy`, `slideous`, or `s5` directory
    placed in this directory will override pandoc's normal defaults.

`--bash-completion`

:   Generate a bash completion script.  To enable bash completion
    with pandoc, add this to your `.bashrc`:

         eval "$(pandoc --bash-completion)"

`--verbose`

:   Give verbose debugging output.  Currently this only has an effect
    with PDF output.

`--list-input-formats`

:   List supported input formats, one per line.

`--list-output-formats`

:   List supported output formats, one per line.

`--list-extensions`

:   List supported Markdown extensions, one per line, followed
    by a `+` or `-` indicating whether it is enabled by default
    in pandoc's Markdown.

`--list-highlight-languages`

:   List supported languages for syntax highlighting, one per
    line.

`--list-highlight-styles`

:   List supported styles for syntax highlighting, one per line.
    See `--highlight-style`.

`-v`, `--version`

:   Print version.

`-h`, `--help`

:   Show usage message.

Reader options
--------------

`-R`, `--parse-raw`

:   Parse untranslatable HTML codes and LaTeX environments as raw HTML
    or LaTeX, instead of ignoring them.  Affects only HTML and LaTeX
    input. Raw HTML can be printed in Markdown, reStructuredText, Emacs Org
    mode, HTML, Slidy, Slideous, DZSlides, reveal.js, and S5 output; raw LaTeX
    can be printed in Markdown, reStructuredText, Emacs Org mode, LaTeX, and
    ConTeXt output.  The default is for the readers to omit untranslatable
    HTML codes and LaTeX environments.  (The LaTeX reader does pass through
    untranslatable LaTeX *commands*, even if `-R` is not specified.)

`-S`, `--smart`

:   Produce typographically correct output, converting straight quotes
    to curly quotes, `---` to em-dashes, `--` to en-dashes, and
    `...` to ellipses. Nonbreaking spaces are inserted after certain
    abbreviations, such as "Mr." (Note: This option is selected automatically
    when the output format is `latex` or `context`, unless `--no-tex-ligatures`
    is used.  It has no effect for `latex` input.)

`--old-dashes`

:   Selects the pandoc <= 1.8.2.1 behavior for parsing smart dashes: `-` before
    a numeral is an en-dash, and `--` is an em-dash.  This option is selected
    automatically for `textile` input.

`--base-header-level=`*NUMBER*

:   Specify the base level for headers (defaults to 1).

`--indented-code-classes=`*CLASSES*

:   Specify classes to use for indented code blocks--for example,
    `perl,numberLines` or `haskell`. Multiple classes may be separated
    by spaces or commas.

`--default-image-extension=`*EXTENSION*

:   Specify a default extension to use when image paths/URLs have no
    extension.  This allows you to use the same source for formats that
    require different kinds of images.  Currently this option only affects
    the Markdown and LaTeX readers.

`--file-scope`

:   Parse each file individually before combining for multifile
    documents. This will allow footnotes in different files with the
    same identifiers to work as expected. If this option is set,
    footnotes and links will not work across files. Reading binary
    files (docx, odt, epub) implies `--file-scope`.

`--filter=`*PROGRAM*

:   Specify an executable to be used as a filter transforming the
    pandoc AST after the input is parsed and before the output is
    written.  The executable should read JSON from stdin and write
    JSON to stdout.  The JSON must be formatted like  pandoc's own
    JSON input and output.  The name of the output format will be
    passed to the filter as the first argument.  Hence,

        pandoc --filter ./caps.py -t latex

    is equivalent to

        pandoc -t json | ./caps.py latex | pandoc -f json -t latex

    The latter form may be useful for debugging filters.

    Filters may be written in any language.  `Text.Pandoc.JSON`
    exports `toJSONFilter` to facilitate writing filters in Haskell.
    Those who would prefer to write filters in python can use the
    module [`pandocfilters`], installable from PyPI. There are also
    pandoc filter libraries in [PHP], [perl], and
    [javascript/node.js].

    In order of preference, pandoc will look for filters in

     1. a specified full or relative path (executable or
     non-executable)

     2. `$DATADIR/filters` (executable or non-executable)

     3. `$PATH` (executable only)

`-M` *KEY*[`=`*VAL*], `--metadata=`*KEY*[`:`*VAL*]

:   Set the metadata field *KEY* to the value *VAL*.  A value specified
    on the command line overrides a value specified in the document.
    Values will be parsed as YAML boolean or string values. If no value is
    specified, the value will be treated as Boolean true.  Like
    `--variable`, `--metadata` causes template variables to be set.
    But unlike `--variable`, `--metadata` affects the metadata of the
    underlying document (which is accessible from filters and may be
    printed in some output formats).

`--normalize`

:   Normalize the document after reading:  merge adjacent
    `Str` or `Emph` elements, for example, and remove repeated `Space`s.

`-p`, `--preserve-tabs`

:   Preserve tabs instead of converting them to spaces (the default).
    Note that this will only affect tabs in literal code spans and code
    blocks; tabs in regular text will be treated as spaces.

`--tab-stop=`*NUMBER*

:   Specify the number of spaces per tab (default is 4).

`--track-changes=accept`|`reject`|`all`

:   Specifies what to do with insertions, deletions, and comments
    produced by the MS Word "Track Changes" feature.  `accept` (the
    default), inserts all insertions, and ignores all
    deletions. `reject` inserts all deletions and ignores
    insertions. Both `accept` and `reject` ignore comments. `all` puts
    in insertions, deletions, and comments, wrapped in spans with
    `insertion`, `deletion`, `comment-start`, and `comment-end`
    classes, respectively. The author and time of change is
    included. `all` is useful for scripting: only accepting changes
    from a certain reviewer, say, or before a certain date. This
    option only affects the docx reader.

`--extract-media=`*DIR*

:   Extract images and other media contained in a docx or epub container
    to the path *DIR*, creating it if necessary, and adjust the images
    references in the document so they point to the extracted files.
    This option only affects the docx and epub readers.

[`pandocfilters`]: https://github.com/jgm/pandocfilters
[PHP]: https://github.com/vinai/pandocfilters-php
[perl]: https://metacpan.org/pod/Pandoc::Filter
[javascript/node.js]: https://github.com/mvhenderson/pandoc-filter-node

General writer options
----------------------

`-s`, `--standalone`

:   Produce output with an appropriate header and footer (e.g. a
    standalone HTML, LaTeX, TEI, or RTF file, not a fragment).  This option
    is set automatically for `pdf`, `epub`, `epub3`, `fb2`, `docx`, and `odt`
    output.

