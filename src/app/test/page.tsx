'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';

export default function Page() {
  const parentRef = React.useRef<any>();

  // The virtualizer
  const rowVirtualizer = useVirtualizer({
    count: 10000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  return (
    <>
      {/* The scrollable element for your list */}
      <div
        ref={parentRef}
        style={{
          height: `400px`,
          overflow: 'auto', // Make it scroll!
        }}
      >
        {/* The large inner element to hold all of the items */}
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {/* Only the visible items in the virtualizer, manually positioned to be in view */}
          {rowVirtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              Row {virtualItem.index}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
