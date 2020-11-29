export class Pagination {

    constructor({
        pagesCount,
        currentPage = 1,
        paginationLength = 10,
        prevNextTemplate = "<button>{{label}}</button>",
        prevLabel = "Previous",
        nextLabel = "Next",
        buttonTemplate = "<button>{{page}}</button>",
        delimiterTemplate = "...",
        onClickCallback = (page) => {
            console.log(page)
        }
    }) {
        this.pagesCount = pagesCount;
        this.currentPage = currentPage;
        this.paginationLength = paginationLength;
        this.prevNextTemplate = prevNextTemplate,
            this.prevLabel = prevLabel,
            this.nextLabel = nextLabel,
            this.buttonTemplate = buttonTemplate
        this.delimiterTemplate = delimiterTemplate
        this.onClickCallback = onClickCallback
    }

    initStructure({
        currentPage,
        pagesCount
    }) {
        return {
            previous: currentPage > 1,
            next: currentPage < pagesCount
        }
    }
    getNums({
        paginationLength,
        currentPage
    }) {
        let nums = [];

        for (let i = 0; i < paginationLength; i++) {
            let page = i + 1;
            nums.push({
                page: page,
                type: "button",
                current: page == currentPage
            });
        }

        return nums;
    }
    getNumsWithDelimiters({
        paginationLength,
        currentPage,
        pagesCount
    }) {
        let nums = [];

        let middlePartLength = paginationLength - 2;

        let middlePart = [];

        middlePart.push({
            page: currentPage,
            type: "button",
            current: true
        });

        let spreadToLeftCounter = currentPage;
        let spreadToRightCounter = currentPage;
        let spreadToLeft = false;
        let spreadToRight = false;
        let spread = true;

        while (spread) {
            spreadToLeftCounter--;
            spreadToRightCounter++;
            spreadToLeft = spreadToLeftCounter > 1;
            spreadToRight = spreadToRightCounter < pagesCount;

            if (spreadToLeft && middlePart.length < middlePartLength) {
                middlePart.unshift({
                    page: spreadToLeftCounter,
                    type: "button"
                });
            }
            if (spreadToRight && middlePart.length < middlePartLength) {
                middlePart.push({
                    page: spreadToRightCounter,
                    type: "button"
                });
            }

            spread = (spreadToLeft || spreadToRight) && middlePart.length < middlePartLength;
        }

        if (middlePart[0].page - 1 > 1) {
            nums.unshift({
                page: -1,
                type: "delimiter"
            });
        }

        if (currentPage != 1) {
            nums.unshift({
                page: 1,
                type: "button"
            });
        }

        nums = nums.concat(middlePart);

        if (middlePart[middlePart.length - 1].page + 1 < pagesCount) {
            nums.push({
                page: -2,
                type: "delimiter"
            });
        }

        if (currentPage != pagesCount) {
            nums.push({
                page: pagesCount,
                type: "button"
            });
        }

        return nums;
    }

    getStructure() {

        let pagesCount = this.pagesCount;
        let currentPage = this.currentPage;
        let paginationLength = this.paginationLength;
        /*

        [previous][first][marker_left][middle_part][marker_right][last][next]

        1) main
    
        - pagination: exists if pagesCount > 1

        2) parts

        - previous:                     currentPage > 1
        - next:                         currentPage < pagesCount
        - first (first == 1):           always visible
        - last (last == pagesCount):    always visible
        - delimiter_left (...):       middle_part[0] - first > 1
        - delimiter_right(...):       last - middle_part[middle_part.length-1] > 1
        - middle_part: length = paginationLength - first.length - last.length

        */

        if (pagesCount <= 1) {
            // console.error(`pagesCount < 1 (${pagesCount})`);
            return;
        }

        let structure = this.initStructure({
            currentPage,
            pagesCount
        });

        let nums;

        //paginationLength: number of buttons in pagination
        if (paginationLength >= pagesCount) {
            paginationLength = pagesCount;
            // prev 1 2 [3] 4 5 6 7 8 9 10 next
            nums = this.getNums({
                paginationLength,
                currentPage
            });
        } else {
            // prev 1 2 [3] 4 5 6 7 8 9 ... 101 next
            nums = this.getNumsWithDelimiters({
                paginationLength,
                pagesCount,
                currentPage
            });
        }

        structure.nums = nums;

        return structure;

    }

    addClass(el, className) {
        if (el.classList) el.classList.add(className);
        else if (!this.hasClass(el, className)) el.className += ' ' + className;
    }

    hasClass(el, className) {
        return el.classList ? el.classList.contains(className) : new RegExp('\\b'+ className+'\\b').test(el.className);
    }

    getHTML() {

        const structure = this.getStructure();

        if (structure) {
            let ul = document.createElement('ul');

            if (structure.previous) {
                let li = document.createElement('li');
                li.innerHTML = this.prevNextTemplate.replace("{{label}}", this.prevLabel);
                li.addEventListener("click", () => this.onClickCallback(--this.currentPage));
                ul.appendChild(li);
            }

            structure.nums.forEach(item => {

                switch (item.type) {
                    case "delimiter":
                        var lid = document.createElement('li');
                        lid.innerHTML = this.delimiterTemplate;
                        ul.appendChild(lid);
                        break;
                    case "button":
                        var lib = document.createElement('li');
                        lib.innerHTML = this.buttonTemplate.replace("{{page}}", item.page);
                        if (item.page == this.currentPage) {
                            this.addClass(lib, "selected");
                        } else {
                            lib.addEventListener("click", () => this.onClickCallback(item.page));
                        }
                        ul.appendChild(lib);
                        break;
                }

            });

            if (structure.next) {
                let li = document.createElement('li');
                li.innerHTML = this.prevNextTemplate.replace("{{label}}", this.nextLabel);
                li.addEventListener("click", () => this.onClickCallback(++this.currentPage));
                ul.appendChild(li);
            }

            return ul;
        }

        return null;

    }
}
