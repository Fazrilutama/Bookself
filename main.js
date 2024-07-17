document.addEventListener("DOMContentLoaded", function () {
  const inputBook = document.getElementById("inputBook");
  const searchBook = document.getElementById("searchBook");
  const searchBookTitle = document.getElementById("searchBookTitle");
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  loadBooksFromLocalStorage();

  inputBook.addEventListener("submit", function (event) {
    event.preventDefault();
    tambahBuku();
  });

  searchBook.addEventListener("submit", function (event) {
    event.preventDefault();
    cariBuku(searchBookTitle.value);
  });

  function tambahBuku() {
    const judulBuku = document.getElementById("inputBookTitle").value;
    const penulisBuku = document.getElementById("inputBookAuthor").value;
    const tahunBuku = parseInt(document.getElementById("inputBookYear").value);
    const sudahSelesai = document.getElementById("inputBookIsComplete").checked;

    const id = +new Date();

    const buku = {
      id: id,
      title: judulBuku,
      author: penulisBuku,
      year: tahunBuku,
      isComplete: sudahSelesai,
    };

    if (sudahSelesai) {
      completeBookshelfList.appendChild(buatBukuElement(buku));
    } else {
      incompleteBookshelfList.appendChild(buatBukuElement(buku));
    }

    saveBooksToLocalStorage();
  }

  function buatBukuElement(buku) {
    const bukuItem = document.createElement("article");
    bukuItem.classList.add("book_item");
    bukuItem.setAttribute("data-id", buku.id);

    const judulBuku = document.createElement("h3");
    judulBuku.innerText = buku.title;

    const penulisBuku = document.createElement("p");
    penulisBuku.innerText = `Penulis: ${buku.author}`;

    const tahunBuku = document.createElement("p");
    tahunBuku.innerText = `Tahun: ${buku.year}`;

    const divAksi = document.createElement("div");
    divAksi.classList.add("action");

    const tombolToggle = document.createElement("button");
    tombolToggle.classList.add(buku.isComplete ? "green" : "red");
    tombolToggle.innerText = buku.isComplete
      ? "Belum selesai dibaca"
      : "Selesai dibaca";
    tombolToggle.addEventListener("click", function () {
      toggleStatusBuku(bukuItem, buku);
    });

    const tombolHapus = document.createElement("button");
    tombolHapus.classList.add("red");
    tombolHapus.innerText = "Hapus buku";
    tombolHapus.addEventListener("click", function () {
      hapusBuku(bukuItem);
    });

    divAksi.append(tombolToggle, tombolHapus);
    bukuItem.append(judulBuku, penulisBuku, tahunBuku, divAksi);

    return bukuItem;
  }

  function toggleStatusBuku(bukuItem, buku) {
    buku.isComplete = !buku.isComplete;

    bukuItem.remove();

    if (buku.isComplete) {
      completeBookshelfList.appendChild(buatBukuElement(buku));
    } else {
      incompleteBookshelfList.appendChild(buatBukuElement(buku));
    }

    saveBooksToLocalStorage();
  }

  function hapusBuku(bukuItem) {
    const idBuku = bukuItem.getAttribute("data-id");
    bukuItem.remove();
    removeBookFromLocalStorage(idBuku);
    saveBooksToLocalStorage();
  }

  function saveBooksToLocalStorage() {
    const allBooks = [];
    incompleteBookshelfList.querySelectorAll(".book_item").forEach((book) => {
      const buku = getBookDetails(book);
      allBooks.push(buku);
    });
    completeBookshelfList.querySelectorAll(".book_item").forEach((book) => {
      const buku = getBookDetails(book);
      allBooks.push(buku);
    });
    localStorage.setItem("bookshelf", JSON.stringify(allBooks));
  }

  function getBookDetails(book) {
    const id = book.getAttribute("data-id");
    const judul = book.querySelector("h3").innerText;
    const penulis = book.querySelector("p:nth-child(2)").innerText.substring(9);
    const tahun = parseInt(
      book.querySelector("p:nth-child(3)").innerText.substring(7)
    ); // Parse to integer
    const isComplete = book
      .querySelector(".action button:first-child")
      .classList.contains("green");
    return { id, title: judul, author: penulis, year: tahun, isComplete };
  }

  function loadBooksFromLocalStorage() {
    const bookList = JSON.parse(localStorage.getItem("bookshelf")) || [];
    bookList.forEach((buku) => {
      const bukuElement = buatBukuElement(buku);
      if (buku.isComplete) {
        completeBookshelfList.appendChild(bukuElement);
      } else {
        incompleteBookshelfList.appendChild(bukuElement);
      }
    });
  }

  function removeBookFromLocalStorage(idBuku) {
    let bookList = JSON.parse(localStorage.getItem("bookshelf")) || [];
    bookList = bookList.filter((buku) => buku.id !== idBuku);
    localStorage.setItem("bookshelf", JSON.stringify(bookList));
  }

  function cariBuku(keyword) {
    const allBooks = document.querySelectorAll(".book_item");
    let found = false;
    allBooks.forEach((book) => {
      const title = book.querySelector("h3").innerText.toLowerCase();
      if (title.includes(keyword.toLowerCase())) {
        book.style.display = "block";
        found = true;
      } else {
        book.style.display = "none";
      }
    });
    if (!found) {
      alert("Buku tidak ditemukan!");
    }
  }
});
