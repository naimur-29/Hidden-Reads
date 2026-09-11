# Book-download retirement

1. Export or back up all `bookDownloads` documents.
2. Record the number of documents and affected `books` documents.
3. Inspect the deployed Firestore rules for broad wildcard permissions.
4. Merge this rule fragment, which denies client reads and writes to `bookDownloads`:

   ```text
   match /bookDownloads/{bookId} {
     allow read, write: if false;
   }
   ```

5. Deploy the merged rules before deleting data.
6. Run a temporary Admin SDK script outside the repository using credentials supplied through the operator environment.
7. Delete every `bookDownloads` document.
8. Remove the `downloads` field from every `books` document with `deleteField()`.
9. Verify that the `bookDownloads` collection contains zero documents.
10. Verify that no `books` document contains `downloads`.
11. Retain the export until production verification is complete.
12. Delete the temporary script and credentials from the operator environment afterward.

A broader `allow` rule can still grant access. The operator must remove or narrow any broad rule that covers `bookDownloads`; a more specific deny block cannot override an existing broad allow.
