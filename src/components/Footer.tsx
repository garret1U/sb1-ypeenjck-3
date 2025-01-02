import { Book } from 'lucide-react';

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 sm:py-1 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center sm:justify-end">
          <a
            href="https://mynssa.nssa-nsca.org/wp-content/uploads/sites/6/2024/01/2024-NSSA-Rule-Book.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-xs text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <Book className="h-3 w-3 mr-1" />
            NSSA Rule Book
          </a>
        </div>
      </div>
    </footer>
  );
}