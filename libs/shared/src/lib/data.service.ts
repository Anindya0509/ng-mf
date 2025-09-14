import { Injectable, Signal, signal, computed, effect } from '@angular/core';
import { Book, Issue, Member } from './model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  private localStorageBooksKey = 'books_data'; // Key for storing books in localStorage
  private localStorageMembersKey = 'members_data'; // Key for storing members in localStorage

  // Load data from localStorage or use default data if not found
  private booksSignal = signal<Book[]>(this.loadBooksFromLocalStorage());
  private membersSignal = signal<Member[]>(this.loadMembersFromLocalStorage());

  private issuesSignal: Signal<Issue[]> = computed(() => {
    const books = this.booksSignal();
    const members = this.membersSignal();

    return books
      .filter(b => b.issued && b.issuedToMemberId)
      .map(b => {
        const member = members.find(m => m.id === b.issuedToMemberId!);
        return {
          bookId: b.id,
          bookName: b.name,
          memberId: member?.id ?? '',
          memberName: member?.name ?? '',
          issueTime: b.issuedTime ?? ''
        };
      });
  });

  constructor() {
    // Automatically save to localStorage whenever the books or members signals change
    effect(() => {
      const books = this.booksSignal();
      this.saveBooksToLocalStorage(books);
    });

    effect(() => {
      const members = this.membersSignal();
      this.saveMembersToLocalStorage(members);
    });
  }

  // Getters for books, members, and issues
  getBooks() {
    return this.booksSignal;
  }

  getMembers() {
    return this.membersSignal;
  }

  getIssues() {
    return this.issuesSignal;
  }

  // Method to issue a book
  issueBook(bookId: string, memberId: string): Observable<void> {
    const books = this.booksSignal();
    const members = this.membersSignal();

    const bookIndex = books.findIndex(b => b.id === bookId);
    const memberIndex = members.findIndex(m => m.id === memberId);

    if (bookIndex === -1 || memberIndex === -1) {
      return new Observable<void>(observer => {
        observer.next();
        observer.complete();
      });
    }

    const book = books[bookIndex];
    const member = members[memberIndex];

    // If the book is already issued, can't issue again
    if (book.issued) {
      return new Observable<void>(observer => {
        observer.next();
        observer.complete();
      });
    }

    // If member already has a book issued, unissue it first
    if (member.issuedBookId) {
      const oldBookIndex = books.findIndex(b => b.id === member.issuedBookId);
      if (oldBookIndex !== -1) {
        // Unissue old book
        const oldBook = books[oldBookIndex];
        books[oldBookIndex] = {
          ...oldBook,
          issued: false,
          issuedToMemberId: undefined,
          issuedTime: undefined
        };
      }
    }

    // Issue new book
    const updatedBook = {
      ...book,
      issued: true,
      issuedToMemberId: memberId,
      issuedTime: new Date().toISOString()
    };

    const updatedMember = {
      ...member,
      issuedBookId: bookId
    };

    // Update arrays immutably
    const updatedBooks = [...books];
    updatedBooks[bookIndex] = updatedBook;

    const updatedMembers = [...members];
    updatedMembers[memberIndex] = updatedMember;

    // Set new values to signals
    this.booksSignal.set(updatedBooks);
    this.membersSignal.set(updatedMembers);

    return new Observable<void>(observer => {
      observer.next();
      observer.complete();
    });
  }

  // Method to unissue a book
  unissueBook(bookId: string): Observable<void> {
    const books = this.booksSignal();
    const members = this.membersSignal();
  
    const bookIndex = books.findIndex(b => b.id === bookId);
  
    if (bookIndex !== -1) {
      const book = books[bookIndex];
  
      if (book.issued && book.issuedToMemberId) {
        const memberIndex = members.findIndex(m => m.id === book.issuedToMemberId);
  
        // Prepare updated book (unissued)
        const updatedBook: Book = {
          ...book,
          issued: false,
          issuedToMemberId: undefined,
          issuedTime: undefined
        };
  
        // Prepare updated member if found
        let updatedMembers = [...members];
        if (memberIndex !== -1) {
          const member = members[memberIndex];
          updatedMembers[memberIndex] = {
            ...member,
            issuedBookId: undefined
          };
        }
  
        // Update books array immutably
        const updatedBooks = [...books];
        updatedBooks[bookIndex] = updatedBook;
  
        this.booksSignal.set(updatedBooks);
        this.membersSignal.set(updatedMembers);
      }
    }
  
    return new Observable<void>(observer => {
      observer.next();
      observer.complete();
    });
  }

  // Private method to load books from localStorage
  private loadBooksFromLocalStorage(): Book[] {
    const savedBooks = localStorage.getItem(this.localStorageBooksKey);
    return savedBooks ? JSON.parse(savedBooks) : [
      { id: 'b1', name: 'The Great Gatsby', author: 'F. Scott Fitzgerald', issued: false },
      { id: 'b2', name: 'To Kill a Mockingbird', author: 'Harper Lee', issued: true, issuedToMemberId: 'm2', issuedTime: '2025-09-01T10:30:00Z' },
      { id: 'b3', name: '1984', author: 'George Orwell', issued: false },
      { id: 'b4', name: 'Pride and Prejudice', author: 'Jane Austen', issued: true, issuedToMemberId: 'm5', issuedTime: '2025-08-28T14:00:00Z' },
      { id: 'b5', name: 'The Catcher in the Rye', author: 'J.D. Salinger', issued: false },
      { id: 'b6', name: 'Moby-Dick', author: 'Herman Melville', issued: false },
      { id: 'b7', name: 'The Hobbit', author: 'J.R.R. Tolkien', issued: false },
      { id: 'b8', name: 'Fahrenheit 451', author: 'Ray Bradbury', issued: true, issuedToMemberId: 'm8', issuedTime: '2025-09-10T09:15:00Z' },
      { id: 'b9', name: 'Jane Eyre', author: 'Charlotte Brontë', issued: false },
      { id: 'b10', name: 'Animal Farm', author: 'George Orwell', issued: false }
    ];
  }

  // Private method to save books to localStorage
  private saveBooksToLocalStorage(books: Book[]): void {
    localStorage.setItem(this.localStorageBooksKey, JSON.stringify(books));
  }

  // Private method to load members from localStorage
  private loadMembersFromLocalStorage(): Member[] {
    const savedMembers = localStorage.getItem(this.localStorageMembersKey);
    return savedMembers ? JSON.parse(savedMembers) : [
      { id: 'm1', name: 'Alice Johnson', age: 28, contactNumber: '555-1234' },
      { id: 'm2', name: 'Bob Smith', age: 35, contactNumber: '555-2345', issuedBookId: 'b2' },
      { id: 'm3', name: 'Charlie Brown', age: 22, contactNumber: '555-3456' },
      { id: 'm4', name: 'Diana Prince', age: 30, contactNumber: '555-4567' },
      { id: 'm5', name: 'Evan Lee', age: 40, contactNumber: '555-5678', issuedBookId: 'b4' },
      { id: 'm6', name: 'Fiona Garcia', age: 27, contactNumber: '555-6789' },
      { id: 'm7', name: 'George Martin', age: 31, contactNumber: '555-7890' },
      { id: 'm8', name: 'Hannah Kim', age: 29, contactNumber: '555-8901', issuedBookId: 'b8' },
      { id: 'm9', name: 'Ian Wright', age: 26, contactNumber: '555-9012' },
      { id: 'm10', name: 'Julia Roberts', age: 33, contactNumber: '555-0123' }
    ];
  }

  // Private method to save members to localStorage
  private saveMembersToLocalStorage(members: Member[]): void {
    localStorage.setItem(this.localStorageMembersKey, JSON.stringify(members));
  }
}
