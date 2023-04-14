import React from "react";
import { Pagination } from "react-bootstrap";

interface PagerProps {
  pageIndex: number;
  pageCount: number;
  onChange: (pageIndex: number) => void;
}

interface PagerButtonProps {
  label: string;
  srLabel: string;
  disabled?: boolean;
  index: number;
}

const Pager: React.FC<PagerProps> = ({ pageIndex, pageCount, onChange }) => {
  const PagerButton: React.FC<PagerButtonProps> = ({
    label,
    srLabel,
    index,
    disabled,
  }) => (
    <li className="page-item">
      <button
        disabled={
          disabled !== undefined
            ? disabled
            : index === pageIndex || index > lastPageIndex || index < 0
        }
        className="page-link"
        type="button"
        onClick={(event) => {
          event.preventDefault();
          onChange(index);
        }}
      >
        <span>{label}</span>
        <span className="sr-only">{srLabel}</span>
      </button>
    </li>
  );

  const lastPageIndex = pageCount - 1;

  return (
    <Pagination className="justify-content-center">
      <>
        <PagerButton index={0} label="«" srLabel="First" />
        <PagerButton index={pageIndex - 1} label="‹" srLabel="Previous" />
      </>
      <PagerButton
        index={0}
        label={`Page ${pageIndex + 1} of ${pageCount}`}
        srLabel="(current)"
        disabled
      />
      <>
        <PagerButton index={pageIndex + 1} label="›" srLabel="Next" />
        <PagerButton index={lastPageIndex} label="»" srLabel="Last" />
      </>
    </Pagination>
  );
};

export default Pager;
