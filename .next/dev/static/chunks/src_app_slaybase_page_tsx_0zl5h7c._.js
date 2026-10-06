(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/slaybase/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SlaybasePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$goodreads$2d$library$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/goodreads-library.json.[json].cjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
/* =========================================================
   GOODREADS LIBRARY DATA
   ========================================================= */ const library = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$goodreads$2d$library$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
/* =========================================================
   STATUS FILTERS
   ========================================================= */ const statusFilters = [
    {
        label: "All Books",
        value: "all",
        count: 2507,
        accent: "pink"
    },
    {
        label: "TBR",
        value: "tbr",
        count: 2115,
        accent: "violet"
    },
    {
        label: "Read",
        value: "read",
        count: 384,
        accent: "ice"
    },
    {
        label: "Current",
        value: "currently-reading",
        count: 4,
        accent: "mixed"
    },
    {
        label: "DNF",
        value: "dnf",
        count: 4,
        accent: "pink"
    }
];
/* =========================================================
   SORT OPTIONS
   ========================================================= */ const sortOptions = [
    {
        label: "Recently Added",
        value: "recently-added"
    },
    {
        label: "Oldest Added",
        value: "oldest-added"
    },
    {
        label: "Title A–Z",
        value: "title-az"
    },
    {
        label: "Title Z–A",
        value: "title-za"
    },
    {
        label: "Highest Rated",
        value: "highest-rated"
    },
    {
        label: "Lowest Rated",
        value: "lowest-rated"
    }
];
const bookAccents = [
    "pink",
    "violet",
    "ice",
    "mixed"
];
function SlaybasePage() {
    _s();
    const [activeStatus, setActiveStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [sortOption, setSortOption] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("recently-added");
    const [visibleCount, setVisibleCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(12);
    const [filtersOpen, setFiltersOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedRatings, setSelectedRatings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedFormats, setSelectedFormats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedSpecialFilters, setSelectedSpecialFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedShelves, setSelectedShelves] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    /* =======================================================
     DERIVED LIBRARY INFORMATION
     ======================================================= */ const books = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SlaybasePage.useMemo[books]": ()=>library.map({
                "SlaybasePage.useMemo[books]": (record)=>record.book
            }["SlaybasePage.useMemo[books]"])
    }["SlaybasePage.useMemo[books]"], []);
    const availableShelves = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SlaybasePage.useMemo[availableShelves]": ()=>{
            const shelves = new Set();
            library.forEach({
                "SlaybasePage.useMemo[availableShelves]": (record)=>{
                    record.rawShelves.forEach({
                        "SlaybasePage.useMemo[availableShelves]": (shelf)=>{
                            if (shelf.trim()) {
                                shelves.add(shelf.trim());
                            }
                        }
                    }["SlaybasePage.useMemo[availableShelves]"]);
                }
            }["SlaybasePage.useMemo[availableShelves]"]);
            return Array.from(shelves).sort({
                "SlaybasePage.useMemo[availableShelves]": (a, b)=>a.localeCompare(b)
            }["SlaybasePage.useMemo[availableShelves]"]);
        }
    }["SlaybasePage.useMemo[availableShelves]"], []);
    /* =======================================================
     ACTIVE DEEP FILTER COUNT
     ======================================================= */ const activeDeepFilterCount = selectedRatings.length + selectedFormats.length + selectedSpecialFilters.length + selectedShelves.length;
    /* =======================================================
     FILTER + SEARCH + SORT
     ======================================================= */ const filteredRecords = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SlaybasePage.useMemo[filteredRecords]": ()=>{
            let results = [
                ...library
            ];
            /* -------------------------
         STATUS
         ------------------------- */ if (activeStatus !== "all") {
                results = results.filter({
                    "SlaybasePage.useMemo[filteredRecords]": (record)=>record.book.status === activeStatus
                }["SlaybasePage.useMemo[filteredRecords]"]);
            }
            /* -------------------------
         SEARCH
         ------------------------- */ const normalizedQuery = searchQuery.trim().toLowerCase();
            if (normalizedQuery) {
                results = results.filter({
                    "SlaybasePage.useMemo[filteredRecords]": (record)=>{
                        const book = record.book;
                        const title = book.title.toLowerCase();
                        const authors = book.authors.join(" ").toLowerCase();
                        const series = book.series?.name?.toLowerCase() ?? "";
                        return title.includes(normalizedQuery) || authors.includes(normalizedQuery) || series.includes(normalizedQuery);
                    }
                }["SlaybasePage.useMemo[filteredRecords]"]);
            }
            /* -------------------------
         RATING
         ------------------------- */ if (selectedRatings.length > 0) {
                results = results.filter({
                    "SlaybasePage.useMemo[filteredRecords]": (record)=>{
                        const rating = record.book.personalRating;
                        return rating !== undefined && selectedRatings.includes(rating);
                    }
                }["SlaybasePage.useMemo[filteredRecords]"]);
            }
            /* -------------------------
         FORMAT
         ------------------------- */ if (selectedFormats.length > 0) {
                results = results.filter({
                    "SlaybasePage.useMemo[filteredRecords]": (record)=>selectedFormats.some({
                            "SlaybasePage.useMemo[filteredRecords]": (format)=>record.book.formats.includes(format)
                        }["SlaybasePage.useMemo[filteredRecords]"])
                }["SlaybasePage.useMemo[filteredRecords]"]);
            }
            /* -------------------------
         SPECIAL FILTERS
         ------------------------- */ if (selectedSpecialFilters.includes("certified-slay")) {
                results = results.filter({
                    "SlaybasePage.useMemo[filteredRecords]": (record)=>record.book.certifiedSlay
                }["SlaybasePage.useMemo[filteredRecords]"]);
            }
            if (selectedSpecialFilters.includes("reread")) {
                results = results.filter({
                    "SlaybasePage.useMemo[filteredRecords]": (record)=>record.readCount > 1
                }["SlaybasePage.useMemo[filteredRecords]"]);
            }
            if (selectedSpecialFilters.includes("tbb-buddy-read")) {
                results = results.filter({
                    "SlaybasePage.useMemo[filteredRecords]": (record)=>record.wasTbbBuddyRead
                }["SlaybasePage.useMemo[filteredRecords]"]);
            }
            /* -------------------------
         GOODREADS SHELVES
         ------------------------- */ if (selectedShelves.length > 0) {
                results = results.filter({
                    "SlaybasePage.useMemo[filteredRecords]": (record)=>selectedShelves.some({
                            "SlaybasePage.useMemo[filteredRecords]": (selectedShelf)=>record.rawShelves.includes(selectedShelf)
                        }["SlaybasePage.useMemo[filteredRecords]"])
                }["SlaybasePage.useMemo[filteredRecords]"]);
            }
            /* -------------------------
         SORTING
         ------------------------- */ results.sort({
                "SlaybasePage.useMemo[filteredRecords]": (a, b)=>{
                    const bookA = a.book;
                    const bookB = b.book;
                    switch(sortOption){
                        case "oldest-added":
                            return new Date(bookA.dateAdded ?? 0).getTime() - new Date(bookB.dateAdded ?? 0).getTime();
                        case "title-az":
                            return bookA.title.localeCompare(bookB.title);
                        case "title-za":
                            return bookB.title.localeCompare(bookA.title);
                        case "highest-rated":
                            return (bookB.personalRating ?? 0) - (bookA.personalRating ?? 0);
                        case "lowest-rated":
                            return (bookA.personalRating ?? 0) - (bookB.personalRating ?? 0);
                        case "recently-added":
                        default:
                            return new Date(bookB.dateAdded ?? 0).getTime() - new Date(bookA.dateAdded ?? 0).getTime();
                    }
                }
            }["SlaybasePage.useMemo[filteredRecords]"]);
            return results;
        }
    }["SlaybasePage.useMemo[filteredRecords]"], [
        activeStatus,
        searchQuery,
        sortOption,
        selectedRatings,
        selectedFormats,
        selectedSpecialFilters,
        selectedShelves
    ]);
    /* =======================================================
     VISIBLE RECORDS
     ======================================================= */ const visibleRecords = filteredRecords.slice(0, visibleCount);
    const remainingBooks = Math.max(filteredRecords.length - visibleRecords.length, 0);
    /* =======================================================
     HANDLERS
     ======================================================= */ function handleStatusChange(status) {
        setActiveStatus(status);
        setVisibleCount(12);
    }
    function handleSearchChange(value) {
        setSearchQuery(value);
        setVisibleCount(12);
    }
    function handleSortChange(value) {
        setSortOption(value);
        setVisibleCount(12);
    }
    function handleLoadMore() {
        setVisibleCount((current)=>current + 12);
    }
    function toggleRating(rating) {
        setSelectedRatings((current)=>current.includes(rating) ? current.filter((item)=>item !== rating) : [
                ...current,
                rating
            ]);
        setVisibleCount(12);
    }
    function toggleFormat(format) {
        setSelectedFormats((current)=>current.includes(format) ? current.filter((item)=>item !== format) : [
                ...current,
                format
            ]);
        setVisibleCount(12);
    }
    function toggleSpecialFilter(filter) {
        setSelectedSpecialFilters((current)=>current.includes(filter) ? current.filter((item)=>item !== filter) : [
                ...current,
                filter
            ]);
        setVisibleCount(12);
    }
    function toggleShelf(shelf) {
        setSelectedShelves((current)=>current.includes(shelf) ? current.filter((item)=>item !== shelf) : [
                ...current,
                shelf
            ]);
        setVisibleCount(12);
    }
    function clearDeepFilters() {
        setSelectedRatings([]);
        setSelectedFormats([]);
        setSelectedSpecialFilters([]);
        setSelectedShelves([]);
        setVisibleCount(12);
    }
    function resetEverything() {
        setActiveStatus("all");
        setSearchQuery("");
        setSortOption("recently-added");
        setSelectedRatings([]);
        setSelectedFormats([]);
        setSelectedSpecialFilters([]);
        setSelectedShelves([]);
        setVisibleCount(12);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "slaybase-page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "slaybase-hero",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "eyebrow",
                                children: [
                                    "LIBRARY DATABASE //",
                                    " ",
                                    books.length.toLocaleString(),
                                    " RECORDS"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/slaybase/page.tsx",
                                lineNumber: 665,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "slaybase-title",
                                children: [
                                    "THE",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: " SLAYBASE"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                        lineNumber: 672,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/slaybase/page.tsx",
                                lineNumber: 670,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "slaybase-intro",
                                children: "Every book. Every shelf. Every questionable decision that somehow became part of the collection."
                            }, void 0, false, {
                                fileName: "[project]/src/app/slaybase/page.tsx",
                                lineNumber: 675,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/slaybase/page.tsx",
                        lineNumber: 664,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "slaybase-orbit",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: books.length.toLocaleString()
                            }, void 0, false, {
                                fileName: "[project]/src/app/slaybase/page.tsx",
                                lineNumber: 683,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                children: "BOOKS INDEXED"
                            }, void 0, false, {
                                fileName: "[project]/src/app/slaybase/page.tsx",
                                lineNumber: 687,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/slaybase/page.tsx",
                        lineNumber: 682,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/slaybase/page.tsx",
                lineNumber: 662,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "slaybase-status-grid",
                children: statusFilters.map((filter)=>{
                    const isActive = activeStatus === filter.value;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>handleStatusChange(filter.value),
                        className: `slaybase-status-card ` + `status-${filter.accent} ` + `${isActive ? "active" : ""}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: filter.label
                            }, void 0, false, {
                                fileName: "[project]/src/app/slaybase/page.tsx",
                                lineNumber: 726,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: filter.count.toLocaleString()
                            }, void 0, false, {
                                fileName: "[project]/src/app/slaybase/page.tsx",
                                lineNumber: 730,
                                columnNumber: 17
                            }, this)
                        ]
                    }, filter.value, true, {
                        fileName: "[project]/src/app/slaybase/page.tsx",
                        lineNumber: 708,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/app/slaybase/page.tsx",
                lineNumber: 699,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "slaybase-controls",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "slaybase-search",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "⌕"
                            }, void 0, false, {
                                fileName: "[project]/src/app/slaybase/page.tsx",
                                lineNumber: 750,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "search",
                                value: searchQuery,
                                onChange: (event)=>handleSearchChange(event.target.value),
                                placeholder: "Search title, author, series...",
                                "aria-label": "Search the Slaybase"
                            }, void 0, false, {
                                fileName: "[project]/src/app/slaybase/page.tsx",
                                lineNumber: 752,
                                columnNumber: 11
                            }, this),
                            searchQuery && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>handleSearchChange(""),
                                "aria-label": "Clear search",
                                className: "slaybase-search-clear",
                                children: "×"
                            }, void 0, false, {
                                fileName: "[project]/src/app/slaybase/page.tsx",
                                lineNumber: 765,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/slaybase/page.tsx",
                        lineNumber: 748,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "slaybase-control-buttons",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setFiltersOpen((current)=>!current),
                                "aria-expanded": filtersOpen,
                                children: [
                                    "FILTERS",
                                    activeDeepFilterCount > 0 ? ` (${activeDeepFilterCount})` : " +"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/slaybase/page.tsx",
                                lineNumber: 782,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "slaybase-sort",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "sr-only",
                                        children: "Sort books"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                        lineNumber: 803,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: sortOption,
                                        onChange: (event)=>handleSortChange(event.target.value),
                                        "aria-label": "Sort books",
                                        children: sortOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: option.value,
                                                children: option.label
                                            }, option.value, false, {
                                                fileName: "[project]/src/app/slaybase/page.tsx",
                                                lineNumber: 819,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                        lineNumber: 807,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/slaybase/page.tsx",
                                lineNumber: 801,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                "aria-label": "Grid view",
                                children: "▦"
                            }, void 0, false, {
                                fileName: "[project]/src/app/slaybase/page.tsx",
                                lineNumber: 836,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                "aria-label": "List view",
                                disabled: true,
                                children: "☰"
                            }, void 0, false, {
                                fileName: "[project]/src/app/slaybase/page.tsx",
                                lineNumber: 843,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/slaybase/page.tsx",
                        lineNumber: 780,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/slaybase/page.tsx",
                lineNumber: 746,
                columnNumber: 7
            }, this),
            filtersOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "slaybase-filter-panel",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "slaybase-filter-header",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "eyebrow",
                                        children: "ADVANCED QUERY"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                        lineNumber: 866,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: "Filter the Slaybase"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                        lineNumber: 870,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/slaybase/page.tsx",
                                lineNumber: 865,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "slaybase-filter-actions",
                                children: [
                                    activeDeepFilterCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: clearDeepFilters,
                                        children: "CLEAR FILTERS"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                        lineNumber: 878,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setFiltersOpen(false),
                                        "aria-label": "Close filters",
                                        children: "×"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                        lineNumber: 888,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/slaybase/page.tsx",
                                lineNumber: 875,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/slaybase/page.tsx",
                        lineNumber: 863,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "slaybase-filter-grid",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
                                className: "slaybase-filter-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                                        children: "RATING"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                        lineNumber: 907,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Pick one or more ratings."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                        lineNumber: 911,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "slaybase-filter-options",
                                        children: [
                                            5,
                                            4,
                                            3,
                                            2,
                                            1
                                        ].map((rating)=>{
                                            const selected = selectedRatings.includes(rating);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>toggleRating(rating),
                                                className: selected ? "selected" : "",
                                                children: [
                                                    "★".repeat(rating),
                                                    " ",
                                                    rating
                                                ]
                                            }, rating, true, {
                                                fileName: "[project]/src/app/slaybase/page.tsx",
                                                lineNumber: 926,
                                                columnNumber: 23
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                        lineNumber: 915,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/slaybase/page.tsx",
                                lineNumber: 905,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
                                className: "slaybase-filter-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                                        children: "FORMAT"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                        lineNumber: 956,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "How was the book consumed?"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                        lineNumber: 960,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "slaybase-filter-options",
                                        children: [
                                            {
                                                label: "Physical",
                                                value: "physical"
                                            },
                                            {
                                                label: "Ebook",
                                                value: "ebook"
                                            },
                                            {
                                                label: "Audiobook",
                                                value: "audiobook"
                                            }
                                        ].map((format)=>{
                                            const selected = selectedFormats.includes(format.value);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>toggleFormat(format.value),
                                                className: selected ? "selected" : "",
                                                children: format.label
                                            }, format.value, false, {
                                                fileName: "[project]/src/app/slaybase/page.tsx",
                                                lineNumber: 994,
                                                columnNumber: 23
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                        lineNumber: 964,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/slaybase/page.tsx",
                                lineNumber: 954,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
                                className: "slaybase-filter-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                                        children: "SLAY DATA"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                        lineNumber: 1023,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "The stuff Goodreads could never make this cute."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                        lineNumber: 1027,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "slaybase-filter-options",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>toggleSpecialFilter("certified-slay"),
                                                className: selectedSpecialFilters.includes("certified-slay") ? "selected" : "",
                                                children: "✦ Certified Slay"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/slaybase/page.tsx",
                                                lineNumber: 1034,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>toggleSpecialFilter("reread"),
                                                className: selectedSpecialFilters.includes("reread") ? "selected" : "",
                                                children: "↻ Rereads"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/slaybase/page.tsx",
                                                lineNumber: 1053,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>toggleSpecialFilter("tbb-buddy-read"),
                                                className: selectedSpecialFilters.includes("tbb-buddy-read") ? "selected" : "",
                                                children: "♡ TBB Buddy Reads"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/slaybase/page.tsx",
                                                lineNumber: 1072,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                        lineNumber: 1032,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/slaybase/page.tsx",
                                lineNumber: 1021,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
                                className: "slaybase-filter-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                                        children: "IMPORTED SHELVES"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                        lineNumber: 1098,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Your original Goodreads organization, preserved."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                        lineNumber: 1102,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "slaybase-filter-options",
                                        children: availableShelves.map((shelf)=>{
                                            const selected = selectedShelves.includes(shelf);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>toggleShelf(shelf),
                                                className: selected ? "selected" : "",
                                                children: shelf.replaceAll("-", " ").toUpperCase()
                                            }, shelf, false, {
                                                fileName: "[project]/src/app/slaybase/page.tsx",
                                                lineNumber: 1118,
                                                columnNumber: 23
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                        lineNumber: 1107,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/slaybase/page.tsx",
                                lineNumber: 1096,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/slaybase/page.tsx",
                        lineNumber: 903,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "slaybase-filter-footer",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    filteredRecords.length.toLocaleString(),
                                    " ",
                                    filteredRecords.length === 1 ? "book matches" : "books match",
                                    " ",
                                    "the current query."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/slaybase/page.tsx",
                                lineNumber: 1152,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setFiltersOpen(false),
                                children: "SHOW RESULTS ✦"
                            }, void 0, false, {
                                fileName: "[project]/src/app/slaybase/page.tsx",
                                lineNumber: 1161,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/slaybase/page.tsx",
                        lineNumber: 1150,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/slaybase/page.tsx",
                lineNumber: 861,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "slaybase-library-heading",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "eyebrow",
                                children: [
                                    "CURRENT QUERY //",
                                    " ",
                                    activeStatus === "all" ? "ALL BOOKS" : activeStatus.replaceAll("-", " ").toUpperCase(),
                                    searchQuery.trim() && ` // "${searchQuery.trim()}"`,
                                    activeDeepFilterCount > 0 && ` // ${activeDeepFilterCount} ACTIVE FILTER${activeDeepFilterCount === 1 ? "" : "S"}`
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/slaybase/page.tsx",
                                lineNumber: 1183,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "section-title",
                                children: "The Library"
                            }, void 0, false, {
                                fileName: "[project]/src/app/slaybase/page.tsx",
                                lineNumber: 1206,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/slaybase/page.tsx",
                        lineNumber: 1181,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "slaybase-results",
                        children: [
                            "SHOWING",
                            " ",
                            visibleRecords.length.toLocaleString(),
                            " ",
                            "OF",
                            " ",
                            filteredRecords.length.toLocaleString()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/slaybase/page.tsx",
                        lineNumber: 1213,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/slaybase/page.tsx",
                lineNumber: 1179,
                columnNumber: 7
            }, this),
            filteredRecords.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "slaybase-empty",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "⌕"
                    }, void 0, false, {
                        fileName: "[project]/src/app/slaybase/page.tsx",
                        lineNumber: 1232,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        children: "THE SLAYBASE FOUND NOTHING."
                    }, void 0, false, {
                        fileName: "[project]/src/app/slaybase/page.tsx",
                        lineNumber: 1236,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Not a single book survived this particular combination of fictional chaos."
                    }, void 0, false, {
                        fileName: "[project]/src/app/slaybase/page.tsx",
                        lineNumber: 1240,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: resetEverything,
                        children: "RESET THE SLAYBASE"
                    }, void 0, false, {
                        fileName: "[project]/src/app/slaybase/page.tsx",
                        lineNumber: 1246,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/slaybase/page.tsx",
                lineNumber: 1230,
                columnNumber: 9
            }, this),
            filteredRecords.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "slaybase-book-grid",
                children: visibleRecords.map((record, index)=>{
                    const book = record.book;
                    const accent = bookAccents[index % bookAccents.length];
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        className: "slaybase-book",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: `/books/${book.id}`,
                                className: `slaybase-book-cover ` + `book-${accent}`,
                                "aria-label": `Open ${book.title}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "book-status",
                                        children: book.status.replaceAll("-", " ").toUpperCase()
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                        lineNumber: 1294,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "book-cover-symbol",
                                        children: "✦"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                        lineNumber: 1303,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: book.title
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                        lineNumber: 1307,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/slaybase/page.tsx",
                                lineNumber: 1285,
                                columnNumber: 19
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "slaybase-book-info",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "book-info-heading",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            href: `/books/${book.id}`,
                                                            children: book.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/slaybase/page.tsx",
                                                            lineNumber: 1323,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                                        lineNumber: 1322,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: book.authors.join(", ")
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                                        lineNumber: 1330,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/slaybase/page.tsx",
                                                lineNumber: 1320,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                "aria-label": `More options for ` + book.title,
                                                children: "•••"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/slaybase/page.tsx",
                                                lineNumber: 1339,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                        lineNumber: 1318,
                                        columnNumber: 21
                                    }, this),
                                    book.personalRating ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "book-rating",
                                        children: [
                                            "★".repeat(book.personalRating),
                                            "☆".repeat(5 - book.personalRating)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                        lineNumber: 1355,
                                        columnNumber: 23
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "book-rating unrated",
                                        children: "NOT YET RATED"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                        lineNumber: 1368,
                                        columnNumber: 23
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "book-tags",
                                        children: [
                                            book.certifiedSlay && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "CERTIFIED SLAY"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/slaybase/page.tsx",
                                                lineNumber: 1379,
                                                columnNumber: 25
                                            }, this),
                                            record.readCount > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "REREAD ×",
                                                    record.readCount
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/slaybase/page.tsx",
                                                lineNumber: 1385,
                                                columnNumber: 25
                                            }, this),
                                            record.wasTbbBuddyRead && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "TBB BUDDY READ"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/slaybase/page.tsx",
                                                lineNumber: 1392,
                                                columnNumber: 25
                                            }, this),
                                            book.primaryFormat && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: book.primaryFormat.toUpperCase()
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/slaybase/page.tsx",
                                                lineNumber: 1398,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/slaybase/page.tsx",
                                        lineNumber: 1376,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/slaybase/page.tsx",
                                lineNumber: 1316,
                                columnNumber: 19
                            }, this)
                        ]
                    }, book.id, true, {
                        fileName: "[project]/src/app/slaybase/page.tsx",
                        lineNumber: 1278,
                        columnNumber: 17
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/app/slaybase/page.tsx",
                lineNumber: 1264,
                columnNumber: 9
            }, this),
            filteredRecords.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "slaybase-load-more",
                children: remainingBooks > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: handleLoadMore,
                            children: "LOAD MORE FROM THE ARCHIVES ↓"
                        }, void 0, false, {
                            fileName: "[project]/src/app/slaybase/page.tsx",
                            lineNumber: 1427,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                remainingBooks.toLocaleString(),
                                " ",
                                "more",
                                " ",
                                remainingBooks === 1 ? "book is" : "books are",
                                " ",
                                "minding",
                                " ",
                                remainingBooks === 1 ? "its" : "their",
                                " ",
                                "business in the database."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/slaybase/page.tsx",
                            lineNumber: 1436,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/slaybase/page.tsx",
                    lineNumber: 1425,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "✦ YOU HAVE REACHED THE END OF THIS SHELF ✦"
                }, void 0, false, {
                    fileName: "[project]/src/app/slaybase/page.tsx",
                    lineNumber: 1455,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/slaybase/page.tsx",
                lineNumber: 1422,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/slaybase/page.tsx",
        lineNumber: 656,
        columnNumber: 5
    }, this);
}
_s(SlaybasePage, "qJCkQykK8YnGfvb4wbJUIRjBdPc=");
_c = SlaybasePage;
var _c;
__turbopack_context__.k.register(_c, "SlaybasePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_slaybase_page_tsx_0zl5h7c._.js.map