'use client';

import { useState, useCallback } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  isAfter,
  isBefore,
  parseISO,
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface DateRange {
  startDate: string | null; // YYYY-MM-DD format
  endDate: string | null;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  disabled?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  labels?: {
    start?: string;
    end?: string;
  };
}

export function DateRangePicker({
  value,
  onChange,
  disabled = false,
  className,
  minDate,
  maxDate,
  labels = { start: '開始日', end: '終了日' },
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value.startDate) {
      return parseISO(value.startDate);
    }
    return new Date();
  });
  const [selectingEnd, setSelectingEnd] = useState(false);

  // 日付文字列から Date に変換
  const startDate = value.startDate ? parseISO(value.startDate) : null;
  const endDate = value.endDate ? parseISO(value.endDate) : null;

  // 月の日付を取得
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { locale: ja });
  const calendarEnd = endOfWeek(monthEnd, { locale: ja });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // 曜日ヘッダー
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  // 日付クリック処理
  const handleDayClick = useCallback(
    (day: Date) => {
      if (disabled) return;

      // 範囲外の日付はクリック不可
      if (minDate && isBefore(day, minDate)) return;
      if (maxDate && isAfter(day, maxDate)) return;

      const dateStr = format(day, 'yyyy-MM-dd');

      if (!selectingEnd || !startDate) {
        // 開始日を選択
        onChange({ startDate: dateStr, endDate: null });
        setSelectingEnd(true);
      } else {
        // 終了日を選択
        if (isBefore(day, startDate)) {
          // 終了日が開始日より前の場合は入れ替え
          onChange({ startDate: dateStr, endDate: value.startDate });
        } else {
          onChange({ ...value, endDate: dateStr });
        }
        setSelectingEnd(false);
        setIsOpen(false);
      }
    },
    [disabled, minDate, maxDate, selectingEnd, startDate, value, onChange]
  );

  // 日付が選択範囲内かチェック
  const isInRange = useCallback(
    (day: Date) => {
      if (!startDate || !endDate) return false;
      return isWithinInterval(day, { start: startDate, end: endDate });
    },
    [startDate, endDate]
  );

  // 日付が選択可能かチェック
  const isDisabled = useCallback(
    (day: Date) => {
      if (minDate && isBefore(day, minDate)) return true;
      if (maxDate && isAfter(day, maxDate)) return true;
      return false;
    },
    [minDate, maxDate]
  );

  // クリア
  const handleClear = () => {
    onChange({ startDate: null, endDate: null });
    setSelectingEnd(false);
  };

  return (
    <div className={cn('relative', className)}>
      {/* 入力フィールド */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Label className="text-xs text-muted-foreground">{labels.start}</Label>
          <div className="relative">
            <Input
              type="text"
              value={value.startDate ?? ''}
              placeholder="YYYY-MM-DD"
              readOnly
              disabled={disabled}
              className="cursor-pointer pr-8"
              onClick={() => !disabled && setIsOpen(true)}
            />
            <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
        <span className="text-muted-foreground mt-5">～</span>
        <div className="flex-1">
          <Label className="text-xs text-muted-foreground">{labels.end}</Label>
          <div className="relative">
            <Input
              type="text"
              value={value.endDate ?? ''}
              placeholder="YYYY-MM-DD"
              readOnly
              disabled={disabled}
              className="cursor-pointer pr-8"
              onClick={() => !disabled && setIsOpen(true)}
            />
            <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
        {(value.startDate || value.endDate) && !disabled && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mt-5"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* カレンダーポップアップ */}
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* カレンダー */}
          <div className="absolute left-0 top-full z-50 mt-2 p-4 bg-card border rounded-lg shadow-lg min-w-[300px]">
            {/* ヘッダー */}
            <div className="flex items-center justify-between mb-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium">
                {format(currentMonth, 'yyyy年M月', { locale: ja })}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* 選択状態の表示 */}
            <div className="text-xs text-muted-foreground text-center mb-2">
              {selectingEnd && startDate
                ? '終了日を選択してください'
                : '開始日を選択してください'}
            </div>

            {/* 曜日ヘッダー */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {weekDays.map((day, index) => (
                <div
                  key={day}
                  className={cn(
                    'text-center text-xs font-medium py-1',
                    index === 0 && 'text-red-500',
                    index === 6 && 'text-blue-500'
                  )}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 日付グリッド */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => {
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isStart = startDate && isSameDay(day, startDate);
                const isEnd = endDate && isSameDay(day, endDate);
                const inRange = isInRange(day);
                const dayDisabled = isDisabled(day);
                const dayOfWeek = day.getDay();

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => handleDayClick(day)}
                    disabled={dayDisabled || !isCurrentMonth}
                    className={cn(
                      'h-8 w-8 rounded text-sm transition-colors',
                      !isCurrentMonth && 'text-muted-foreground/30',
                      isCurrentMonth && !dayDisabled && 'hover:bg-muted',
                      isCurrentMonth && dayOfWeek === 0 && 'text-red-500',
                      isCurrentMonth && dayOfWeek === 6 && 'text-blue-500',
                      dayDisabled && 'opacity-50 cursor-not-allowed',
                      inRange && !isStart && !isEnd && 'bg-primary/10',
                      (isStart || isEnd) && 'bg-primary text-primary-foreground'
                    )}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>

            {/* プリセットボタン */}
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  onChange({
                    startDate: format(startOfMonth(today), 'yyyy-MM-dd'),
                    endDate: format(endOfMonth(today), 'yyyy-MM-dd'),
                  });
                  setIsOpen(false);
                }}
              >
                今月
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const lastMonth = subMonths(new Date(), 1);
                  onChange({
                    startDate: format(startOfMonth(lastMonth), 'yyyy-MM-dd'),
                    endDate: format(endOfMonth(lastMonth), 'yyyy-MM-dd'),
                  });
                  setIsOpen(false);
                }}
              >
                先月
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// 単一日付ピッカー
interface DatePickerProps {
  value: string | null; // YYYY-MM-DD format
  onChange: (date: string | null) => void;
  disabled?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  label?: string;
  placeholder?: string;
}

export function DatePicker({
  value,
  onChange,
  disabled = false,
  className,
  minDate,
  maxDate,
  label,
  placeholder = 'YYYY-MM-DD',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value) {
      return parseISO(value);
    }
    return new Date();
  });

  const selectedDate = value ? parseISO(value) : null;

  // 月の日付を取得
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { locale: ja });
  const calendarEnd = endOfWeek(monthEnd, { locale: ja });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  const handleDayClick = (day: Date) => {
    if (disabled) return;
    if (minDate && isBefore(day, minDate)) return;
    if (maxDate && isAfter(day, maxDate)) return;

    onChange(format(day, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const isDisabledDay = (day: Date) => {
    if (minDate && isBefore(day, minDate)) return true;
    if (maxDate && isAfter(day, maxDate)) return true;
    return false;
  };

  return (
    <div className={cn('relative', className)}>
      {label && <Label className="text-xs text-muted-foreground">{label}</Label>}
      <div className="relative">
        <Input
          type="text"
          value={value ?? ''}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          className="cursor-pointer pr-8"
          onClick={() => !disabled && setIsOpen(true)}
        />
        <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="absolute left-0 top-full z-50 mt-2 p-4 bg-card border rounded-lg shadow-lg min-w-[280px]">
            <div className="flex items-center justify-between mb-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium">
                {format(currentMonth, 'yyyy年M月', { locale: ja })}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
              {weekDays.map((day, index) => (
                <div
                  key={day}
                  className={cn(
                    'text-center text-xs font-medium py-1',
                    index === 0 && 'text-red-500',
                    index === 6 && 'text-blue-500'
                  )}
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => {
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const dayDisabled = isDisabledDay(day);
                const dayOfWeek = day.getDay();

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => handleDayClick(day)}
                    disabled={dayDisabled || !isCurrentMonth}
                    className={cn(
                      'h-8 w-8 rounded text-sm transition-colors',
                      !isCurrentMonth && 'text-muted-foreground/30',
                      isCurrentMonth && !dayDisabled && 'hover:bg-muted',
                      isCurrentMonth && dayOfWeek === 0 && 'text-red-500',
                      isCurrentMonth && dayOfWeek === 6 && 'text-blue-500',
                      dayDisabled && 'opacity-50 cursor-not-allowed',
                      isSelected && 'bg-primary text-primary-foreground'
                    )}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-center mt-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onChange(format(new Date(), 'yyyy-MM-dd'));
                  setIsOpen(false);
                }}
              >
                今日
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
