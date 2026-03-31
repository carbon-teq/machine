"use client";

import React from 'react';

interface MarimoEmbedProps {
  notebookPath: string;
  title?: string;
  height?: string;
}

export default function MarimoEmbed({ notebookPath, title = "Marimo Notebook", height = "800px" }: MarimoEmbedProps) {
  const baseUrl = process.env.NEXT_PUBLIC_MARIMO_BASE_URL?.replace(/\/$/, "");
  const resolvedPath = /^https?:\/\//.test(notebookPath)
    ? notebookPath
    : baseUrl
      ? `${baseUrl}${notebookPath}`
      : notebookPath;

  return (
    <div className="w-full my-8 border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-950 dark:border-gray-800">
      <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
        <a 
          href={resolvedPath} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Open in New Tab ↗
        </a>
      </div>
      <iframe
        src={resolvedPath}
        width="100%"
        height={height}
        className="w-full border-0"
        allow="clipboard-read; clipboard-write"
        sandbox="allow-scripts allow-same-origin allow-downloads allow-popups allow-forms"
        title={title}
      />
    </div>
  );
}
