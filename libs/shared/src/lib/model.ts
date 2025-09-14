// libs/shared/src/lib/models.ts

export interface Book {
    id: string;
    name: string;
    author: string;
    issued: boolean;
    issuedToMemberId?: string;
    issuedTime?: string;  // ISO date or so
  }
  
  export interface Member {
    id: string;
    name: string;
    age: number;
    contactNumber: string;
    issuedBookId?: string;
  }
  
  export interface Issue {
    bookId: string;
    bookName: string;
    memberId: string;
    memberName: string;
    issueTime: string;
  }
  