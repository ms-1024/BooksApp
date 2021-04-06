{
  'use strict';

  const select = {
    templateOf: {
      bookTemplate: '#template-book',
    },
    containerOf: {
      booksList: '.books-list',
      favorite: 'favorite',
      favoriteBooks: [],
      filters: '.filters',
      filtersBooks: [],
    },
    imageOf: {
      bookImage: 'book__image',
      dataId: 'data-id',
      hidden: 'hidden',
    }
  };

  const templates = {
    bookTemplate: Handlebars.compile(document.querySelector(select.templateOf.bookTemplate).innerHTML),
  };

  class BookList {
    constructor() {
      const thisBooksList = this;
      thisBooksList.data = dataSource.books;
      thisBooksList.getElements();
      thisBooksList.render();
      thisBooksList.initActions();
    }

    getElements() {
      const thisBooksList = this;

      thisBooksList.bookWrapper = document.querySelector(select.containerOf.booksList);
      thisBooksList.booksList = document.querySelector(select.containerOf.booksList);
      thisBooksList.filterList = document.querySelector(select.containerOf.filters);
    }

    determineRatingBgc(rating) {
      let color1 = '#fefcea';
      let color2 = '#f1da36';
      if (rating <= 8) {
        color1 = '#b4df5b';
        color2 = color1;
      } else if (rating <= 9) {
        color1 = '#299a0b';
        color2 = color1;
      } else {
        color1 = '#ff0084';
        color2 = color1;
      }
      return `linear-gradient(to bottom, ${color1} 0%, ${color2} 100%);`;
    }

    render() {
      const thisBooksList = this;
      for (const book of thisBooksList.data) {
        book.ratingBgc = thisBooksList.determineRatingBgc(book.rating);
        book.ratingWidth = book.rating * 10;
        const generatedHTML = templates.bookTemplate(book);
        const element = utils.createDOMFromHTML(generatedHTML);
        thisBooksList.bookWrapper.appendChild(element);
      }
    }

    filterBooks() {
      const thisBooksList = this;
      for(const book of thisBooksList.data) {
        const hiddenBook = document.querySelector(`.book__image[data-id="${book.id}"]`);
        let shouldBeHidden = false;
        for(const filter of select.containerOf.filtersBooks) {
          if (!book.details[filter]) {
            shouldBeHidden = true;
            break;
          }
        }
        if(shouldBeHidden) {
          hiddenBook.classList.add(select.imageOf.hidden);

        } else {
          hiddenBook.classList.remove(select.imageOf.hidden);
        }
      }
    }

    initActions() {
      const thisBooksList = this;
      thisBooksList.booksList.addEventListener('dblclick', function(e) {
        e.preventDefault();
        const clickedElement = e.target.offsetParent;
        console.log(clickedElement);
        if(clickedElement.classList.contains(select.imageOf.bookImage)) {
          let data_id = '';
          console.log(this);
          if(!select.containerOf.favoriteBooks.includes(data_id) && !clickedElement.classList.contains(select.containerOf.favorite)) {
            clickedElement.classList.add(select.containerOf.favorite);
            data_id = clickedElement.getAttribute(select.imageOf.dataId);
            console.log(data_id);
            select.containerOf.favoriteBooks.push(data_id);
            console.log('Tablica przed usunięciem: ', select.containerOf.favoriteBooks);
          } else {
            clickedElement.classList.remove(select.containerOf.favorite);
            data_id = clickedElement.getAttribute(select.imageOf.dataId);
            const pos = select.containerOf.favoriteBooks.indexOf(data_id);
            console.log('Pozycja elementu: ', pos);
            select.containerOf.favoriteBooks.splice(pos, 1);
            console.log('Tablica po usunięciu: ', select.containerOf.favoriteBooks);
          }
        }
      });
      thisBooksList.filterList.addEventListener('click', function(e) {
        const clickedElement = e.target;
        console.log(clickedElement);
        if(clickedElement.tagName === 'INPUT' && clickedElement.type === 'checkbox' && clickedElement.name === 'filter') {
          console.log(clickedElement.getAttribute('value'));
          if(clickedElement.checked) {
            select.containerOf.filtersBooks.push(clickedElement.value);
            console.log(select.containerOf.filtersBooks);
            thisBooksList.filterBooks();
          } else {
            const pos = select.containerOf.filtersBooks.indexOf(clickedElement.value);
            select.containerOf.filtersBooks.splice(pos, 1);
            console.log(select.containerOf.filtersBooks);
            thisBooksList.filterBooks();
          }
        }
      });
    }
  }

  const app = new BookList();
  app;
}
