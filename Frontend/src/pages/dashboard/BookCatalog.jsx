// import { useState, useEffect } from "react";
// import API from "@/lib/axios";
// import {
//   Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
// } from "@/components/ui/table";
// import {
//   Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,
// } from "@/components/ui/sheet";
// import {
//   DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Plus, MoreHorizontal, Search, Loader2, Edit, Trash2 } from "lucide-react";
// import toast from "react-hot-toast";

// const BookCatalog = () => {
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [isSheetOpen, setIsSheetOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   // Form State for Add/Edit
//   const initialFormState = {
//     title: "", author: "", isbn: "", genre: "",
//     price: "", stockQuantity: "", reorderLevel: "5", supplier: ""
//   };
//   const [formData, setFormData] = useState(initialFormState);
//   const [editingId, setEditingId] = useState(null);

//   // const fetchBooks = async () => {
//   //   setLoading(true);
//   //   try {
//   //     const res = await API.get("/books");
//   //     setBooks(res.data.data || res.data || []);
//   //   } catch (error) {
//   //     toast.error("Failed to load books");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const fetchBooks = async () => {
//     setLoading(true);
//     try {
//       const res = await API.get("/books");
//       // --- FIX START ---
//       // The backend returns { success: true, books: [...], pagination: {...} }
//       // We must extract the 'books' array specifically.
//       setBooks(res.data.books || []); 
//       // --- FIX END ---
//     } catch (error) {
//       toast.error("Failed to load books");
//       setBooks([]); // Ensure it remains an array on error
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchBooks();
//   }, []);

//   const handleSave = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       if (editingId) {
//         await API.put(`/books/${editingId}`, formData);
//         toast.success("Book updated");
//       } else {
//         await API.post("/books", formData);
//         toast.success("Book added");
//       }
//       setIsSheetOpen(false);
//       fetchBooks();
//       setFormData(initialFormState);
//       setEditingId(null);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Operation failed");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const openEdit = (book) => {
//     setFormData({
//       title: book.title, author: book.author, isbn: book.isbn,
//       genre: book.genre, price: book.price, stockQuantity: book.stockQuantity,
//       reorderLevel: book.reorderLevel, supplier: book.supplier || ""
//     });
//     setEditingId(book._id);
//     setIsSheetOpen(true);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this book?")) return;
//     try {
//       await API.delete(`/books/${id}`);
//       toast.success("Book deleted");
//       setBooks(books.filter((b) => b._id !== id));
//     } catch (error) {
//       toast.error("Failed to delete book");
//     }
//   };

//   // Filter books locally for now
//   const filteredBooks = books.filter(b => 
//     b.title.toLowerCase().includes(search.toLowerCase()) || 
//     b.isbn.includes(search)
//   );

//   return (
//     <div className="space-y-6 fade-in p-2">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight">Book Catalog</h2>
//           <p className="text-muted-foreground">Manage your library collection.</p>
//         </div>
        
//         <Sheet open={isSheetOpen} onOpenChange={(open) => {
//             setIsSheetOpen(open);
//             if(!open) { setEditingId(null); setFormData(initialFormState); }
//         }}>
//           <SheetTrigger asChild>
//             <Button><Plus className="mr-2 h-4 w-4" /> Add Book</Button>
//           </SheetTrigger>
//           <SheetContent className="overflow-y-auto">
//             <SheetHeader>
//               <SheetTitle>{editingId ? "Edit Book" : "Add New Book"}</SheetTitle>
//               <SheetDescription>
//                 Fill in the details below. Click save when you're done.
//               </SheetDescription>
//             </SheetHeader>
//             <form onSubmit={handleSave} className="space-y-4 py-4">
//               <div className="space-y-2">
//                 <Label>Title</Label>
//                 <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
//               </div>
//               <div className="space-y-2">
//                 <Label>Author</Label>
//                 <Input value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} required />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                     <Label>ISBN</Label>
//                     <Input value={formData.isbn} onChange={e => setFormData({...formData, isbn: e.target.value})} required />
//                 </div>
//                 <div className="space-y-2">
//                     <Label>Genre</Label>
//                     <Input value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} required />
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                     <Label>Price ($)</Label>
//                     <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
//                 </div>
//                 <div className="space-y-2">
//                     <Label>Stock Qty</Label>
//                     <Input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <Label>Reorder Level (Alert Threshold)</Label>
//                 <Input type="number" value={formData.reorderLevel} onChange={e => setFormData({...formData, reorderLevel: e.target.value})} />
//               </div>
//               <Button type="submit" className="w-full" disabled={isSubmitting}>
//                 {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                 {editingId ? "Update Book" : "Save Book"}
//               </Button>
//             </form>
//           </SheetContent>
//         </Sheet>
//       </div>

//       <div className="flex items-center py-4">
//         <div className="relative w-72">
//             <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input 
//                 placeholder="Search by title or ISBN..." 
//                 className="pl-8"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//             />
//         </div>
//       </div>

//       <div className="rounded-md border bg-card">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Title</TableHead>
//               <TableHead>ISBN</TableHead>
//               <TableHead>Price</TableHead>
//               <TableHead>Stock</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//               <TableRow><TableCell colSpan={5} className="h-24 text-center"><Loader2 className="animate-spin mx-auto" /></TableCell></TableRow>
//             ) : filteredBooks.length === 0 ? (
//               <TableRow><TableCell colSpan={5} className="h-24 text-center">No books found.</TableCell></TableRow>
//             ) : (
//               filteredBooks.map((book) => (
//                 <TableRow key={book._id}>
//                   <TableCell>
//                     <div className="font-medium">{book.title}</div>
//                     <div className="text-xs text-muted-foreground">{book.author}</div>
//                   </TableCell>
//                   <TableCell className="font-mono text-xs">{book.isbn}</TableCell>
//                   <TableCell>${book.price}</TableCell>
//                   <TableCell>
//                     <Badge variant={book.stock <= book.reorderLevel ? "destructive" : "outline"}>
//                         {book.stock}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                         <DropdownMenuItem onClick={() => openEdit(book)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
//                         <DropdownMenuItem onClick={() => handleDelete(book._id)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// };

// export default BookCatalog;

import { useState, useEffect } from "react";
import API from "@/lib/axios";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter
} from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal, Search, Loader2, Edit, Trash2, Book, Box } from "lucide-react";
import toast from "react-hot-toast";

const BookCatalog = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const initialFormState = {
    title: "", author: "", isbn: "", genre: "",
    price: "", stockQuantity: "", reorderLevel: "5", supplier: ""
  };
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await API.get("/books");
      setBooks(res.data.books || []);
    } catch (error) {
      toast.error("Failed to load books");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await API.put(`/books/${editingId}`, formData);
        toast.success("Book updated");
      } else {
        await API.post("/books", formData);
        toast.success("Book added");
      }
      setIsSheetOpen(false);
      fetchBooks();
      setFormData(initialFormState);
      setEditingId(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (book) => {
    setFormData({
      title: book.title, 
      author: book.author, 
      isbn: book.isbn,
      genre: book.genre, 
      price: book.price, 
      stockQuantity: book.stockQuantity,
      reorderLevel: book.reorderLevel, 
      supplier: book.supplier || ""
    });
    setEditingId(book._id);
    setIsSheetOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await API.delete(`/books/${id}`);
      toast.success("Book deleted");
      setBooks(books.filter((b) => b._id !== id));
    } catch (error) {
      toast.error("Failed to delete book");
    }
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    b.isbn.includes(search)
  );

  return (
    <div className="space-y-6 fade-in p-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Book Catalog</h2>
          <p className="text-muted-foreground">Manage your library collection.</p>
        </div>
        
        <Sheet open={isSheetOpen} onOpenChange={(open) => {
            setIsSheetOpen(open);
            if(!open) { setEditingId(null); setFormData(initialFormState); }
        }}>
          <SheetTrigger asChild>
            <Button className="shadow-sm"><Plus className="mr-2 h-4 w-4" /> Add New Book</Button>
          </SheetTrigger>
          
          {/* UPDATED: Added 'p-6' for padding around the edges */}
          <SheetContent className="sm:max-w-[600px] overflow-y-auto p-6">
            <SheetHeader className="mb-6 space-y-2 border-b pb-4">
              <SheetTitle className="text-2xl flex items-center gap-2">
                {editingId ? <Edit className="h-5 w-5 text-primary"/> : <Plus className="h-5 w-5 text-primary"/>}
                {editingId ? "Edit Book Details" : "Add New Book"}
              </SheetTitle>
              <SheetDescription>
                {editingId 
                  ? "Make changes to the book details below. Click save when you're done." 
                  : "Enter the details for the new book to add it to the catalog."}
              </SheetDescription>
            </SheetHeader>

            <form onSubmit={handleSave} className="space-y-8">
              {/* SECTION 1: GENERAL INFO */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-medium">
                    <Book className="h-4 w-4" />
                    <h3 className="text-sm uppercase tracking-wider">General Information</h3>
                </div>
                
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-xs font-semibold text-muted-foreground uppercase">Book Title</Label>
                        <Input 
                            id="title" 
                            value={formData.title} 
                            onChange={e => setFormData({...formData, title: e.target.value})} 
                            placeholder="e.g. The Great Gatsby"
                            className="h-10"
                            required 
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="author" className="text-xs font-semibold text-muted-foreground uppercase">Author</Label>
                            <Input 
                                id="author" 
                                value={formData.author} 
                                onChange={e => setFormData({...formData, author: e.target.value})} 
                                placeholder="e.g. F. Scott Fitzgerald"
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="genre" className="text-xs font-semibold text-muted-foreground uppercase">Genre</Label>
                            <Input 
                                id="genre" 
                                value={formData.genre} 
                                onChange={e => setFormData({...formData, genre: e.target.value})} 
                                placeholder="e.g. Classic Fiction"
                                required 
                            />
                        </div>
                    </div>
                </div>
              </div>

              {/* SEPARATOR */}
              <div className="h-px bg-border/50" />

              {/* SECTION 2: INVENTORY & PRICING */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-medium">
                    <Box className="h-4 w-4" />
                    <h3 className="text-sm uppercase tracking-wider">Inventory & Pricing</h3>
                </div>

                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="isbn" className="text-xs font-semibold text-muted-foreground uppercase">ISBN</Label>
                            <Input 
                                id="isbn" 
                                value={formData.isbn} 
                                onChange={e => setFormData({...formData, isbn: e.target.value})} 
                                placeholder="978-3-16-148410-0"
                                className="font-mono text-sm"
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="supplier" className="text-xs font-semibold text-muted-foreground uppercase">Supplier</Label>
                            <Input 
                                id="supplier" 
                                value={formData.supplier} 
                                onChange={e => setFormData({...formData, supplier: e.target.value})} 
                                placeholder="Penguin Books"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-xs font-semibold text-muted-foreground uppercase">Price ($)</Label>
                            <Input 
                                id="price" 
                                type="number" 
                                value={formData.price} 
                                onChange={e => setFormData({...formData, price: e.target.value})} 
                                className="font-medium"
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock" className="text-xs font-semibold text-muted-foreground uppercase">Stock Qty</Label>
                            <Input 
                                id="stock" 
                                type="number" 
                                value={formData.stockQuantity} 
                                onChange={e => setFormData({...formData, stockQuantity: e.target.value})} 
                                className={formData.stockQuantity <= formData.reorderLevel ? "border-red-300 bg-red-50 text-red-900" : ""}
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reorder" className="text-xs font-semibold text-muted-foreground uppercase">Reorder Lvl</Label>
                            <Input 
                                id="reorder" 
                                type="number" 
                                value={formData.reorderLevel} 
                                onChange={e => setFormData({...formData, reorderLevel: e.target.value})} 
                            />
                        </div>
                    </div>
                </div>
              </div>

              <SheetFooter className="pt-4 border-t gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => setIsSheetOpen(false)}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingId ? "Save Changes" : "Create Book"}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center py-4">
        <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search by title, author or ISBN..." 
                className="pl-9 bg-background shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
      </div>

      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Book Details</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="h-32 text-center"><Loader2 className="animate-spin mx-auto h-6 w-6 text-primary" /></TableCell></TableRow>
            ) : filteredBooks.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground">No books found in the catalog.</TableCell></TableRow>
            ) : (
              filteredBooks.map((book) => (
                <TableRow key={book._id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <div className="font-medium text-base">{book.title}</div>
                    <div className="text-xs text-muted-foreground">{book.author} • <span className="italic">{book.genre}</span></div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{book.isbn}</TableCell>
                  <TableCell className="font-medium">${Number(book.price).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={book.stockQuantity <= book.reorderLevel ? "destructive" : "outline"} className={book.stockQuantity > book.reorderLevel ? "bg-emerald-50 text-emerald-700 border-emerald-200" : ""}>
                        {book.stockQuantity} Units
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      {/* UPDATED: Added width and padding to the dropdown menu */}
                      <DropdownMenuContent align="end" className="w-48 p-2">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openEdit(book)}><Edit className="mr-2 h-4 w-4" /> Edit Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(book._id)} className="text-red-600 focus:text-red-600"><Trash2 className="mr-2 h-4 w-4" /> Delete Book</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BookCatalog;