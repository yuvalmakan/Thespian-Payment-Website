"use client";

import { useMemo, useState } from "react";
import { generateSeatLayout, SEAT_PRICE } from "@/lib/seatLayout";

export default function SeatMap({ showTitle, showSubtitle }) {
  const { rows, totalSeats } = useMemo(() => generateSeatLayout(), []);
  const [selected, setSelected] = useState(() => new Set());

  function toggleSeat(seat) {
    if (seat.status === "booked") return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(seat.id)) {
        next.delete(seat.id);
      } else {
        next.add(seat.id);
      }
      return next;
    });
  }

  const selectedList = Array.from(selected).sort();
  const total = selectedList.length * SEAT_PRICE;

  return (
    <div className="wrap">
      <header className="head">
        <p className="eyebrow">{totalSeats} seats total</p>
        <h1>{showTitle}</h1>
        <p className="subtitle">{showSubtitle}</p>
      </header>

      <div className="stageArea">
        <div className="stage">STAGE</div>
      </div>

      <div className="mapScroll">
        <div className="map">
          {rows.map((row) => (
            <div className="row" key={row.rowLabel}>
              <span className="rowLabel">{row.rowLabel}</span>
              <div className="blocks">
                {row.blocks.map((block, bi) => (
                  <div className="block" key={bi}>
                    {block.map((seat) => (
                      <button
                        key={seat.id}
                        type="button"
                        className={`seat ${seat.status} ${
                          selected.has(seat.id) ? "selected" : ""
                        }`}
                        disabled={seat.status === "booked"}
                        onClick={() => toggleSeat(seat)}
                        aria-label={`Seat ${seat.label}, ${
                          selected.has(seat.id) ? "selected" : seat.status
                        }`}
                        title={seat.label}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <span className="rowLabel rowLabelRight">{row.rowLabel}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="legend">
        <span className="legendItem">
          <i className="swatch available" /> Available
        </span>
        <span className="legendItem">
          <i className="swatch selected" /> Selected
        </span>
        <span className="legendItem">
          <i className="swatch booked" /> Taken
        </span>
      </div>

      <div className="summaryBar">
        <div className="summaryInfo">
          {selectedList.length === 0 ? (
            <span className="summaryHint">Tap a seat to select it</span>
          ) : (
            <>
              <span className="summaryCount">
                {selectedList.length} seat{selectedList.length > 1 ? "s" : ""}
              </span>
              <span className="summarySeats">{selectedList.join(", ")}</span>
            </>
          )}
        </div>
        <div className="summaryAction">
          <span className="summaryTotal">₹{total}</span>
          <button
            type="button"
            className="continueBtn"
            disabled={selectedList.length === 0}
          >
            Continue
          </button>
        </div>
      </div>

      <style jsx>{`
        .wrap {
          max-width: 640px;
          margin: 0 auto;
          padding: 48px 20px 160px;
        }

        .head {
          text-align: center;
          margin-bottom: 36px;
        }

        .eyebrow {
          font-size: 13px;
          color: var(--ink-muted);
          margin: 0 0 10px;
          letter-spacing: 0.02em;
        }

        h1 {
          font-family: var(--font-display);
          font-weight: 500;
          font-size: clamp(28px, 5vw, 40px);
          margin: 0 0 10px;
          line-height: 1.15;
        }

        .subtitle {
          color: var(--ink-muted);
          font-size: 14px;
          margin: 0;
        }

        .stageArea {
          display: flex;
          justify-content: center;
          margin-bottom: 40px;
        }

        .stage {
          width: 78%;
          max-width: 420px;
          height: 34px;
          background: linear-gradient(
            180deg,
            var(--curtain) 0%,
            var(--curtain-deep) 100%
          );
          clip-path: polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.25em;
          color: var(--ink);
          opacity: 0.85;
          box-shadow: 0 12px 40px -8px rgba(122, 31, 43, 0.65);
        }

        .mapScroll {
          overflow-x: auto;
          padding-bottom: 8px;
        }

        .map {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: max-content;
          margin: 0 auto;
        }

        .row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .rowLabel {
          width: 18px;
          text-align: center;
          font-size: 11px;
          color: var(--ink-muted);
          font-variant-numeric: tabular-nums;
        }

        .rowLabelRight {
          margin-left: -2px;
        }

        .blocks {
          display: flex;
          gap: 22px;
        }

        .block {
          display: flex;
          gap: 5px;
        }

        .seat {
          width: 22px;
          height: 22px;
          border-radius: 5px;
          border: 1.5px solid var(--gold);
          background: transparent;
          padding: 0;
          cursor: pointer;
          transition: transform 0.12s ease, background 0.12s ease;
        }

        .seat:hover:not(:disabled) {
          transform: translateY(-2px);
          background: rgba(201, 162, 39, 0.18);
        }

        .seat.selected {
          background: var(--gold-bright);
          border-color: var(--gold-bright);
        }

        .seat.booked {
          border-color: var(--booked);
          background: var(--booked);
          cursor: not-allowed;
        }

        .legend {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 28px;
          flex-wrap: wrap;
        }

        .legendItem {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          color: var(--ink-muted);
        }

        .swatch {
          width: 13px;
          height: 13px;
          border-radius: 4px;
          border: 1.5px solid var(--gold);
          display: inline-block;
        }

        .swatch.available {
          background: transparent;
        }

        .swatch.selected {
          background: var(--gold-bright);
          border-color: var(--gold-bright);
        }

        .swatch.booked {
          background: var(--booked);
          border-color: var(--booked);
        }

        .summaryBar {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--bg-panel);
          border-top: 1px solid rgba(201, 162, 39, 0.2);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .summaryInfo {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .summaryHint {
          font-size: 13px;
          color: var(--ink-muted);
        }

        .summaryCount {
          font-size: 14px;
          font-weight: 600;
        }

        .summarySeats {
          font-size: 12px;
          color: var(--ink-muted);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .summaryAction {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
        }

        .summaryTotal {
          font-family: var(--font-display);
          font-size: 18px;
        }

        .continueBtn {
          background: var(--gold);
          color: #1a0f10;
          border: none;
          border-radius: 8px;
          padding: 11px 22px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .continueBtn:hover:not(:disabled) {
          background: var(--gold-bright);
        }

        .continueBtn:disabled {
          background: var(--booked);
          color: var(--booked-text);
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
