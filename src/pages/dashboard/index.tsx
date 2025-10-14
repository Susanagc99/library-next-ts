import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Input, Button, Switch, Tabs, Tab, Card, CardBody, CardHeader } from "@heroui/react";
import { CheckCircleIcon, XCircleIcon, BookOpenIcon, UserGroupIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { postAuthor, getAuthors, type Author } from "../../services/authors";
import { postBook, getBooks, updateBook, deleteBook, type Book } from "../../services/books";

interface AuthorFormData {
  name: string;
  nationality: string;
  birthYear: string;
  isActive: boolean;
}

interface BookFormData {
  title: string;
  authorId: string;
  category: string;
  publishedYear: string;
  availableCopies: string;
  img: string;
}

interface Filters {
  authorId: string;
  category: string;
  title: string;
}

const Dashboard = () => {
  const router = useRouter();
  const [userSession, setUserSession] = useState<{
    username: string;
    name: string;
    role: string;
    isActive: boolean;
    loginTime: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados para autores
  const [authorFormData, setAuthorFormData] = useState<AuthorFormData>({
    name: "",
    nationality: "",
    birthYear: "",
    isActive: false,
  });
  const [authors, setAuthors] = useState<Author[]>([]);
  const [authorErrors, setAuthorErrors] = useState<string[]>([]);

  // Estados para libros
  const [bookFormData, setBookFormData] = useState<BookFormData>({
    title: "",
    authorId: "",
    category: "",
    publishedYear: "",
    availableCopies: "",
    img: "",
  });
  const [books, setBooks] = useState<Book[]>([]);
  const [bookErrors, setBookErrors] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({
    authorId: "",
    category: "",
    title: "",
  });

  // Estados generales
  const [activeTab, setActiveTab] = useState("authors");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Verificar sesión al cargar el componente
  useEffect(() => {
    const session = localStorage.getItem("userSession");
    if (session) {
      setUserSession(JSON.parse(session));
      setLoading(false);
      loadData();
    } else {
      router.push("/");
    }
  }, [router]);

  // Cargar datos iniciales
  const loadData = async () => {
    try {
      const [authorsData, booksData] = await Promise.all([
        getAuthors(),
        getBooks()
      ]);
      setAuthors(authorsData);
      setBooks(booksData);
    } catch (error) {
      console.error("Error loading data:", error);
      setErrorMessage("Error loading data");
    }
  };

  // Limpiar mensajes después de 3 segundos
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const handleClick = () => {
    // Limpiar sesión del localStorage
    localStorage.removeItem("userSession");
    router.push("/");
  };

  // Manejar cambios en formulario de autores
  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthorFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar cambios en formulario de libros
  const handleBookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar cambios en switch de autores
  const handleAuthorSwitchChange = (value: boolean) => {
    setAuthorFormData((prev) => ({
      ...prev,
      isActive: value,
    }));
  };

  // Manejar cambios en filtros
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Enviar formulario de autor
  const handleAuthorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const erroresFormulario = validarFormularioAutor();

    if (erroresFormulario.length > 0) {
      setAuthorErrors(erroresFormulario);
      return;
    }

    try {
      setAuthorErrors([]);
      await postAuthor({
        name: authorFormData.name,
        nationality: authorFormData.nationality,
        birthYear: parseInt(authorFormData.birthYear),
        isActive: authorFormData.isActive,
      });

      setSuccessMessage("Author created successfully!");
      setAuthorFormData({
        name: "",
        nationality: "",
        birthYear: "",
        isActive: false,
      });
      loadData(); // Recargar datos
    } catch (error) {
      setErrorMessage("Error creating author");
      console.error("Error:", error);
    }
  };

  // Enviar formulario de libro
  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const erroresFormulario = validarFormularioLibro();

    if (erroresFormulario.length > 0) {
      setBookErrors(erroresFormulario);
      return;
    }

    try {
      setBookErrors([]);

      if (editingBook) {
        // Actualizar libro existente
        await updateBook(editingBook.idBook.toString(), {
          title: bookFormData.title,
          authorId: parseInt(bookFormData.authorId),
          category: bookFormData.category,
          publishedYear: parseInt(bookFormData.publishedYear),
          availableCopies: parseInt(bookFormData.availableCopies),
          img: bookFormData.img,
        });
        setSuccessMessage("Book updated successfully!");
      } else {
        // Crear nuevo libro
        await postBook({
          title: bookFormData.title,
          authorId: parseInt(bookFormData.authorId),
          category: bookFormData.category,
          publishedYear: parseInt(bookFormData.publishedYear),
          availableCopies: parseInt(bookFormData.availableCopies),
          img: bookFormData.img,
        });
        setSuccessMessage("Book created successfully!");
      }

      // Limpiar formulario y estado de edición
      setBookFormData({
        title: "",
        authorId: "",
        category: "",
        publishedYear: "",
        availableCopies: "",
        img: "",
      });
      setEditingBook(null);
      loadData(); // Recargar datos
    } catch (error) {
      setErrorMessage(editingBook ? "Error updating book" : "Error creating book");
      console.error("Error:", error);
    }
  };

  // Derivar mensajes de error para autores
  const authorNameError = authorErrors.find((err) => err.toLowerCase().includes("name"));
  const authorNationalityError = authorErrors.find((err) =>
    err.toLowerCase().includes("nationality")
  );
  const authorBirthYearError = authorErrors.find((err) =>
    err.toLowerCase().includes("birth")
  );

  // Derivar mensajes de error para libros
  const bookTitleError = bookErrors.find((err) => err.toLowerCase().includes("title"));
  const bookAuthorIdError = bookErrors.find((err) => err.toLowerCase().includes("author"));
  const bookCategoryError = bookErrors.find((err) => err.toLowerCase().includes("category"));
  const bookPublishedYearError = bookErrors.find((err) => err.toLowerCase().includes("published"));
  const bookAvailableCopiesError = bookErrors.find((err) => err.toLowerCase().includes("available"));
  const bookImgError = bookErrors.find((err) => err.toLowerCase().includes("img"));

  // Validar formulario de autor
  const validarFormularioAutor = (): string[] => {
    const errores: string[] = [];

    if (!authorFormData.name.trim()) errores.push("Name is required");
    if (!authorFormData.nationality.trim()) errores.push("Nationality is required");
    if (!authorFormData.birthYear) errores.push("Birth year is required");

    return errores;
  };

  // Validar formulario de libro
  const validarFormularioLibro = (): string[] => {
    const errores: string[] = [];

    if (!bookFormData.title.trim()) errores.push("Title is required");
    if (!bookFormData.authorId.trim()) errores.push("Author ID is required");
    if (!bookFormData.category.trim()) errores.push("Category is required");
    if (!bookFormData.publishedYear.trim()) errores.push("Published year is required");
    if (!bookFormData.availableCopies.trim()) errores.push("Available copies is required");
    if (!bookFormData.img.trim()) errores.push("Image URL is required");

    // Validar que authorId existe en la lista de autores
    if (bookFormData.authorId && !authors.find(a => a.authorId === parseInt(bookFormData.authorId))) {
      errores.push("Author ID does not exist");
    }

    return errores;
  };

  // Función para obtener el nombre del autor por ID
  const getAuthorName = (authorId: number) => {
    const author = authors.find(a => a.authorId === authorId);
    return author ? author.name : `Author ID: ${authorId}`;
  };

  // Función para eliminar libro
  const handleDeleteBook = async (bookId: string) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteBook(bookId);
        setSuccessMessage("Book deleted successfully!");
        loadData();
      } catch (error) {
        setErrorMessage("Error deleting book");
        console.error("Error:", error);
      }
    }
  };

  // Función para editar libro
  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setBookFormData({
      title: book.title,
      authorId: book.authorId.toString(),
      category: book.category,
      publishedYear: book.publishedYear.toString(),
      availableCopies: book.availableCopies.toString(),
      img: book.img,
    });
    // Cambiar a la pestaña de libros para mostrar el formulario pre-llenado
    setActiveTab("books");
  };

  // Función para cancelar edición
  const handleCancelEdit = () => {
    setEditingBook(null);
    setBookFormData({
      title: "",
      authorId: "",
      category: "",
      publishedYear: "",
      availableCopies: "",
      img: "",
    });
  };

  // Filtrar libros
  const filteredBooks = books.filter(book => {
    const matchesAuthorId = !filters.authorId || book.authorId.toString() === filters.authorId;
    const matchesCategory = !filters.category || book.category.toLowerCase().includes(filters.category.toLowerCase());
    const matchesTitle = !filters.title || book.title.toLowerCase().includes(filters.title.toLowerCase());

    return matchesAuthorId && matchesCategory && matchesTitle;
  });

  // Mostrar loading mientras se verifica la sesión
  if (loading) {
    return (
      <div className="dash-container">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dash-container">
      <div className="w-full max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Library Dashboard</h1>
          <div className="text-right">
            <p className="text-sm text-gray-600">Welcome, {userSession?.name}</p>
            <p className="text-xs text-gray-500">Role: {userSession?.role}</p>
            <Button
              onPress={handleClick}
              className="mt-8 bg-linear-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Mensajes de éxito y error */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        {/* Pestañas */}
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as string)}
          className="w-full"
        >
          <Tab
            key="authors"
            title={
              <div className="flex items-center space-x-2">
                <UserGroupIcon className="w-4 h-4" />
                <span>Authors</span>
              </div>
            }
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Formulario de autores */}
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold">Add New Author</h3>
                </CardHeader>
                <CardBody>
                  <form onSubmit={handleAuthorSubmit} noValidate>
                    <div className="space-y-4">
                      <Input
                        type="text"
                        name="name"
                        label="Name"
                        placeholder="Enter author's name"
                        value={authorFormData.name}
                        onChange={handleAuthorChange}
                        isInvalid={!!authorNameError}
                        errorMessage={authorNameError || ""}
                      />

                      <Input
                        type="text"
                        name="nationality"
                        label="Nationality"
                        placeholder="Enter author's nationality"
                        value={authorFormData.nationality}
                        onChange={handleAuthorChange}
                        isInvalid={!!authorNationalityError}
                        errorMessage={authorNationalityError || ""}
                      />

                      <Input
                        type="number"
                        name="birthYear"
                        label="Birth Year"
                        placeholder="Enter birth year"
                        value={authorFormData.birthYear}
                        onChange={handleAuthorChange}
                        isInvalid={!!authorBirthYearError}
                        errorMessage={authorBirthYearError || ""}
                      />

                      <div className="active-container text-gray-500">
                        <label className="block mb-2">Is the author active?</label>
                        <Switch
                          isSelected={authorFormData.isActive}
                          onValueChange={handleAuthorSwitchChange}
                          color="success"
                          endContent={<XCircleIcon />}
                          size="lg"
                          startContent={<CheckCircleIcon />}
                        />
                      </div>

                      <Button className="w-full" type="submit" variant="bordered">
                        Add Author
                      </Button>
                    </div>
                  </form>
                </CardBody>
              </Card>

              {/* Lista de autores */}
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold">Authors List</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {authors.map((author) => (
                      <div key={author.authorId} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{author.name}</h4>
                            <p className="text-sm text-gray-600">{author.nationality}</p>
                            <p className="text-sm text-gray-500">Born: {author.birthYear}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded text-xs ${author.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                              }`}>
                              {author.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <p className="text-xs text-gray-400 mt-1">ID: {author.authorId}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {authors.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No authors found</p>
                    )}
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>

          <Tab
            key="books"
            title={
              <div className="flex items-center space-x-2">
                <BookOpenIcon className="w-4 h-4" />
                <span>Books</span>
              </div>
            }
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Formulario de libros */}
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold">
                    {editingBook ? `Edit Book: ${editingBook.title}` : "Add New Book"}
                  </h3>
                </CardHeader>
                <CardBody>
                  <form onSubmit={handleBookSubmit} noValidate>
                    <div className="space-y-4">
                      <Input
                        type="text"
                        name="title"
                        label="Title"
                        placeholder="Enter book title"
                        value={bookFormData.title}
                        onChange={handleBookChange}
                        isInvalid={!!bookTitleError}
                        errorMessage={bookTitleError || ""}
                      />

                      <Input
                        type="number"
                        name="authorId"
                        label="Author ID"
                        placeholder="Enter author ID"
                        value={bookFormData.authorId}
                        onChange={handleBookChange}
                        isInvalid={!!bookAuthorIdError}
                        errorMessage={bookAuthorIdError || ""}
                      />

                      <Input
                        type="text"
                        name="category"
                        label="Category"
                        placeholder="Enter book category"
                        value={bookFormData.category}
                        onChange={handleBookChange}
                        isInvalid={!!bookCategoryError}
                        errorMessage={bookCategoryError || ""}
                      />

                      <Input
                        type="number"
                        name="publishedYear"
                        label="Published Year"
                        placeholder="Enter published year"
                        value={bookFormData.publishedYear}
                        onChange={handleBookChange}
                        isInvalid={!!bookPublishedYearError}
                        errorMessage={bookPublishedYearError || ""}
                      />

                      <Input
                        type="number"
                        name="availableCopies"
                        label="Available Copies"
                        placeholder="Enter available copies"
                        value={bookFormData.availableCopies}
                        onChange={handleBookChange}
                        isInvalid={!!bookAvailableCopiesError}
                        errorMessage={bookAvailableCopiesError || ""}
                      />

                      <Input
                        type="url"
                        name="img"
                        label="Image URL"
                        placeholder="Enter image URL"
                        value={bookFormData.img}
                        onChange={handleBookChange}
                        isInvalid={!!bookImgError}
                        errorMessage={bookImgError || ""}
                      />

                      <div className="flex gap-2">
                        <Button className="flex-1" type="submit" variant="bordered" color="primary">
                          {editingBook ? "Update Book" : "Add Book"}
                        </Button>
                        {editingBook && (
                          <Button
                            className="flex-1"
                            variant="bordered"
                            color="default"
                            onPress={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </form>
                </CardBody>
              </Card>

              {/* Filtros y lista de libros */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <h3 className="text-xl font-semibold">Books List</h3>
                </CardHeader>
                <CardBody>
                  {/* Filtros - Layout horizontal */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-sm mb-3">Filters</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        type="text"
                        name="title"
                        label="Title"
                        placeholder="Filter by title"
                        value={filters.title}
                        onChange={handleFilterChange}
                        size="sm"
                      />
                      <Input
                        type="number"
                        name="authorId"
                        label="Author ID"
                        placeholder="Filter by author ID"
                        value={filters.authorId}
                        onChange={handleFilterChange}
                        size="sm"
                      />
                      <Input
                        type="text"
                        name="category"
                        label="Category"
                        placeholder="Filter by category"
                        value={filters.category}
                        onChange={handleFilterChange}
                        size="sm"
                      />
                    </div>
                  </div>

                  {/* Lista de libros */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {filteredBooks.map((book) => (
                      <Card key={book.idBook} className="hover:shadow-lg transition-shadow">
                        <CardBody className="p-4">
                          <div className="flex gap-4">
                            {/* Imagen del libro - más prominente */}
                            <div className="flex-shrink-0">
                              {book.img ? (
                                <Image
                                  src={book.img}
                                  alt={book.title}
                                  width={120}
                                  height={160}
                                  className="object-cover rounded-lg shadow-md"
                                  onError={(e) => {
                                    // Si la imagen falla, mostrar un placeholder
                                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDEyMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCA4MEM2MCA4MCA2MCA4MCA2MCA4MEM2MCA4MCA2MCA4MCA2MCA4MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI0MCIgeT0iNjAiPgo8cGF0aCBkPSJNMjAgMTBDMTQuNDc3MSAxMCAxMCAxNC40NzcxIDEwIDIwQzEwIDI1LjUyMjkgMTQuNDc3MSAzMCAyMCAzMEMyNS41MjI5IDMwIDMwIDI1LjUyMjkgMzAgMjBDMzAgMTQuNDc3MSAyNS41MjI5IDEwIDIwIDEwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTUgMTVIMjVWMTVIMTVaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo8L3N2Zz4K';
                                  }}
                                />
                              ) : (
                                <div className="w-[120px] h-[160px] bg-gray-200 rounded-lg flex items-center justify-center">
                                  <BookOpenIcon className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>

                            {/* Información del libro */}
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <h4 className="font-bold text-lg mb-2 line-clamp-2">{book.title}</h4>
                                <div className="space-y-1 text-sm">
                                  <p className="text-gray-600">
                                    <span className="font-medium">Author:</span> {getAuthorName(book.authorId)}
                                  </p>
                                  <p className="text-gray-600">
                                    <span className="font-medium">Category:</span> {book.category}
                                  </p>
                                  <p className="text-gray-600">
                                    <span className="font-medium">Published:</span> {book.publishedYear}
                                  </p>
                                  <p className="text-gray-600">
                                    <span className="font-medium">Available:</span>
                                    <span className={`ml-1 px-2 py-1 rounded text-xs ${book.availableCopies > 0
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                      }`}>
                                      {book.availableCopies} copies
                                    </span>
                                  </p>
                                </div>
                              </div>

                              {/* Botones de acción */}
                              <div className="flex gap-2 mt-4">
                                <Button
                                  size="sm"
                                  variant="flat"
                                  color="primary"
                                  startContent={<PencilIcon className="w-4 h-4" />}
                                  onPress={() => handleEditBook(book)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="flat"
                                  color="danger"
                                  startContent={<TrashIcon className="w-4 h-4" />}
                                  onPress={() => handleDeleteBook(book.idBook.toString())}
                                >
                                  Delete
                                </Button>
                              </div>

                              <p className="text-xs text-gray-400 mt-2">Book ID: {book.idBook}</p>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                    {filteredBooks.length === 0 && (
                      <div className="col-span-full text-center py-8">
                        <BookOpenIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">No books found</p>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>
        </Tabs>


      </div>
    </div>
  );
};

export default Dashboard;
