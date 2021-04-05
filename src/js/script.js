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
      const thisBookList = this;
      thisBookList.data = dataSource.books;
      thisBookList.render(thisBookList.determineRatingBgc);
      thisBookList.initActions(thisBookList.filterBooks);
    }

    determineRatingBgc(rating) {
      let color1 = '';
      let color2 = '';
      if (rating < 6) {
        color1 = '#fefcea';
        color2 = '#f1da36';
      } else if (rating <= 8) {
        color1 = '#b4df5b';
        color2 = color1;
      } else if (rating <= 9) {
        color1 = '#299a0b';
        color2 = color1;
      } else {
        color1 = '#ff0084';
        color2 = color1;
      }
      const background = `linear-gradient(to bottom, ${color1} 0%, ${color2} 100%);`;
      return background;
    }

    render(cb) {
      const bookWrapper = document.querySelector(select.containerOf.booksList);
      for (const book of dataSource.books) {
        book.ratingBgc = cb(book.rating);
        book.ratingWidth = book.rating * 10;
        const generatedHTML = templates.bookTemplate(book);
        const element = utils.createDOMFromHTML(generatedHTML);
        bookWrapper.appendChild(element);
      }
    }

    filterBooks() {
      for(const book of dataSource.books) {
        let shouldBeHidden = false;
        for(const filter of select.containerOf.filtersBooks) {
          if (!book.details[filter]) {
            shouldBeHidden = true;
            break;
          }
        }
        if(shouldBeHidden) {
          const hiddenBook = document.querySelector(`.book__image[data-id="${book.id}"]`);
          hiddenBook.classList.add(select.imageOf.hidden);
        } else {
          const hiddenBook = document.querySelector(`.book__image[data-id="${book.id}"]`);
          hiddenBook.classList.remove(select.imageOf.hidden);
        }
      }
    }

    initActions(cb) {
      const booksList = document.querySelector(select.containerOf.booksList);
      const filterList = document.querySelector(select.containerOf.filters);
      booksList.addEventListener('dblclick', function(e) {
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
      filterList.addEventListener('click', function(e) {
        const clickedElement = e.target;
        console.log(clickedElement);
        if(clickedElement.tagName === 'INPUT' && clickedElement.type === 'checkbox' && clickedElement.name === 'filter') {
          console.log(clickedElement.getAttribute('value'));
          if(clickedElement.checked) {
            select.containerOf.filtersBooks.push(clickedElement.value);
            console.log(select.containerOf.filtersBooks);
            cb();
          } else {
            const pos = select.containerOf.filtersBooks.indexOf(clickedElement.value);
            select.containerOf.filtersBooks.splice(pos, 1);
            console.log(select.containerOf.filtersBooks);
            cb();
          }
        }
      });
    }
  }

  const app = new BookList();
  app;
}
