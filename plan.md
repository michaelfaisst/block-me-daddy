# Statistics Dashboard Implementation Plan

## Overview

Add a comprehensive statistics dashboard to track blocked site attempts and analyze productivity patterns.

## User Requirements

- **Data Management**: Users can clear all statistics data
- **Navigation**: Use tabs to split the settings page and statistics dashboard
- **Time Granularity**: Support both per-hour (today) and per-day (week/month) views
- **Privacy**: Store timestamps for each block attempt for detailed time-of-day analysis
- **Top Sites**: Show top 10 most blocked sites (configurable)

## Technical Architecture

### 1. Data Storage Schema

#### Block Attempt Record

```typescript
// src/dto/index.ts
export const blockAttemptSchema = z.object({
    id: z.string(), // CUID
    timestamp: z.number(), // Unix timestamp (ms)
    siteId: z.string(), // Reference to blocked site
    url: z.string() // Full URL attempted
});

export type BlockAttempt = z.infer<typeof blockAttemptSchema>;

export const statisticsSchema = z.object({
    blockAttempts: z.array(blockAttemptSchema)
});

export type Statistics = z.infer<typeof statisticsSchema>;
```

#### Storage Structure

- **Key**: `statistics` in Chrome local storage
- **Size Estimation**: ~150 bytes per attempt → ~66,000 attempts per 10MB
- **No automatic deletion**: Users manually clear via UI

### 2. Background Script Changes

#### Track Block Attempts

**File**: `src/background.ts`

**Changes**:

1. Import new schema and CUID generator
2. Modify the `chrome.webNavigation.onBeforeNavigate` listener to:
    - Check if site should be blocked (existing logic)
    - If blocked, save a block attempt record to storage:
        ```typescript
        const blockAttempt: BlockAttempt = {
            id: createId(),
            timestamp: Date.now(),
            siteId: matchedSite.id,
            url: details.url
        };
        ```
3. Add function to append block attempts to storage array

### 3. Statistics Library

#### New File: `src/lib/statistics.ts`

**Purpose**: Data processing and aggregation for charts

**Functions**:

- `getBlockAttemptsInRange(attempts: BlockAttempt[], startDate: Date, endDate: Date): BlockAttempt[]`
- `aggregateByDay(attempts: BlockAttempt[]): { date: string, count: number }[]`
- `aggregateByHour(attempts: BlockAttempt[]): { hour: number, count: number }[]`
- `aggregateByDayOfWeek(attempts: BlockAttempt[]): { day: string, count: number }[]`
- `aggregateByTimeOfDay(attempts: BlockAttempt[]): { hour: number, count: number }[]`
- `getTopBlockedSites(attempts: BlockAttempt[], sites: Site[], limit: number): { site: Site, count: number }[]`
- `getStorageUsage(): Promise<{ used: number, total: number, percentage: number }>`

### 4. UI Components

#### A. Tab Navigation Component

**New File**: `src/components/tabs-navigation.tsx`

**Purpose**: Tabbed interface for Settings vs Statistics

**Structure**:

```typescript
<Tabs defaultValue="settings">
    <TabsList>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="statistics">Statistics</TabsTrigger>
    </TabsList>
    <TabsContent value="settings">
        {/* Existing settings UI */}
    </TabsContent>
    <TabsContent value="statistics">
        <StatisticsDashboard />
    </TabsContent>
</Tabs>
```

**Notes**:

- Use shadcn `Tabs` component (need to install if not present)
- Preserve existing settings page layout within first tab

#### B. Statistics Dashboard Component

**New File**: `src/components/statistics/index.tsx`

**Purpose**: Main dashboard container

**Layout**:

```
┌─────────────────────────────────────────────────┐
│ Statistics Dashboard                   [Clear]  │
├─────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│ │ Total   │ │ Today   │ │ This    │            │
│ │ Blocks  │ │ Blocks  │ │ Week    │            │
│ │  1,234  │ │   45    │ │  234    │            │
│ └─────────┘ └─────────┘ └─────────┘            │
├─────────────────────────────────────────────────┤
│ Block Attempts Over Time         [7d|30d|All]   │
│ ┌───────────────────────────────────────────┐   │
│ │        Area/Line Chart                    │   │
│ └───────────────────────────────────────────┘   │
├─────────────────────────────────────────────────┤
│ Top Blocked Sites                  [5|10|20]    │
│ ┌───────────────────────────────────────────┐   │
│ │        Horizontal Bar Chart               │   │
│ └───────────────────────────────────────────┘   │
├─────────────────────────────────────────────────┤
│ ┌─────────────────────┐ ┌─────────────────────┐│
│ │ Blocks by Day       │ │ Blocks by Hour      ││
│ │ (Mon-Sun)           │ │ (24-hour)           ││
│ │ Bar Chart           │ │ Bar Chart           ││
│ └─────────────────────┘ └─────────────────────┘│
├─────────────────────────────────────────────────┤
│ Storage: 0.5 MB / 10 MB (5%)                    │
└─────────────────────────────────────────────────┘
```

**Features**:

- Load statistics from Chrome storage via `useChromeStorageLocal`
- Time range selector for "Over Time" chart (7 days, 30 days, All time)
- Top sites limit selector (5, 10, 20 sites)
- "Clear All Statistics" button with confirmation dialog
- Storage usage indicator at bottom

#### C. Stat Card Component

**New File**: `src/components/statistics/stat-card.tsx`

**Purpose**: Reusable card for displaying single metrics

**Props**:

```typescript
interface StatCardProps {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: { value: number; direction: "up" | "down" };
}
```

**Styling**: Use shadcn `Card` component

#### D. Chart Components

**Files**:

- `src/components/statistics/blocks-over-time-chart.tsx` - Area chart
- `src/components/statistics/top-sites-chart.tsx` - Horizontal bar chart
- `src/components/statistics/day-of-week-chart.tsx` - Vertical bar chart
- `src/components/statistics/time-of-day-chart.tsx` - Vertical bar chart

**Library**: shadcn charts (based on Recharts)

- Install via: `npx shadcn@latest add chart`
- Reference: https://ui.shadcn.com/docs/components/chart

**Chart Specifics**:

1. **Blocks Over Time** (Area Chart)
    - X-axis: Date (per-hour if today, per-day otherwise)
    - Y-axis: Number of blocks
    - Color: Gradient fill
    - Responsive to time range selection

2. **Top Blocked Sites** (Bar Chart - Horizontal)
    - Y-axis: Site domain/URL
    - X-axis: Block count
    - Show site favicon if available
    - Responsive to limit selection (5/10/20)

3. **Blocks by Day of Week** (Bar Chart - Vertical)
    - X-axis: Mon, Tue, Wed, Thu, Fri, Sat, Sun
    - Y-axis: Total blocks
    - Helps identify productivity patterns

4. **Blocks by Time of Day** (Bar Chart - Vertical)
    - X-axis: Hours (0-23)
    - Y-axis: Block count
    - Useful for identifying distraction patterns

### 5. Page Structure Changes

#### Modify: `src/options/page.tsx`

**Changes**:

1. Import new `TabsNavigation` component
2. Wrap existing content in "Settings" tab
3. Add "Statistics" tab with `StatisticsDashboard` component
4. Preserve existing layout and functionality

### 6. Testing

#### Unit Tests

**New File**: `src/lib/statistics.test.ts`

**Test Cases**:

- Date range filtering
- Aggregation by day/hour/day-of-week/time-of-day
- Top sites calculation with edge cases (ties, empty data)
- Storage usage calculation

#### Manual Testing Scenarios

1. Fresh install (no statistics data)
2. Block attempts tracking across different sites
3. Time range switching (7d → 30d → All)
4. Top sites limit switching (5 → 10 → 20)
5. Clear statistics functionality
6. Responsive layout on different screen sizes
7. Dark mode compatibility

### 7. Implementation Phases

#### Phase 1: Data Layer (Day 1) ✅ COMPLETE

- [x] Add `BlockAttempt` and `Statistics` schemas to `src/dto/index.ts`
- [x] Update `src/background.ts` to track block attempts
- [x] Create `src/lib/statistics.ts` with aggregation functions
- [x] Write unit tests for statistics library

#### Phase 2: UI Foundation (Day 2) ✅ COMPLETE

- [x] Install shadcn `Tabs` component if needed
- [x] Install shadcn `Chart` component
- [x] Create `StatCard` component
- [x] Update `src/options/page.tsx` with tab navigation
- [x] Create empty `StatisticsDashboard` component

#### Phase 3: Statistics Dashboard (Day 3-4) ✅ COMPLETE

- [x] Implement stat cards (total, today, this week)
- [x] Create "Blocks Over Time" chart with time range selector
- [x] Create "Top Blocked Sites" chart with limit selector
- [x] Create "Blocks by Day of Week" chart
- [x] Create "Blocks by Time of Day" chart
- [x] Add storage usage indicator

#### Phase 4: Features & Polish (Day 5) ✅ COMPLETE

- [x] Implement "Clear All Statistics" with confirmation dialog
- [x] Add empty state handling (no data yet)
- [x] Ensure responsive design (mobile/tablet/desktop)
- [x] Dark mode compatibility testing
- [x] Add loading states while fetching data

#### Phase 5: Testing & Documentation (Day 6)

- [ ] Run full test suite
- [ ] Manual testing of all scenarios
- [ ] Update `CHANGELOG.md`
- [ ] Take screenshots for documentation
- [ ] Final code review and cleanup

## Statistics Tracked

### Primary Metrics

1. **Total Block Attempts** (all-time count)
2. **Today's Blocks** (count since midnight)
3. **This Week's Blocks** (count since Monday)

### Charts

1. **Block Attempts Over Time** (trend analysis)
2. **Top 10 Most Blocked Sites** (problematic sites identification)
3. **Blocks by Day of Week** (weekly pattern analysis)
4. **Blocks by Time of Day** (hourly pattern analysis)

### System Info

- **Storage Usage** (MB used / 10 MB total)

## Future Enhancements (Not in Initial Implementation)

- Export statistics as JSON/CSV
- Configurable retention period
- Weekly/monthly email reports
- Comparison with previous periods (% change)
- Most productive day/week highlights

## Technical Notes

### Performance Considerations

- All aggregations happen in-memory (don't cache in storage)
- Use `useMemo` for expensive calculations
- Lazy load chart components
- Debounce time range/limit selectors

### Storage Management

- Monitor storage usage via `chrome.storage.local.getBytesInUse()`
- Show warning at 80% capacity
- Suggest clearing old data at 90% capacity

### Error Handling

- Gracefully handle corrupted statistics data
- Fallback to empty state if schema validation fails
- Log errors to console for debugging

### Accessibility

- Ensure charts have proper ARIA labels
- Keyboard navigation for tab switching
- Screen reader support for metrics
- Color-blind friendly chart colors

## Dependencies to Install

```bash
# If not already present
npx shadcn@latest add tabs
npx shadcn@latest add chart
```

## Files to Create

- `src/components/statistics/index.tsx`
- `src/components/statistics/stat-card.tsx`
- `src/components/statistics/blocks-over-time-chart.tsx`
- `src/components/statistics/top-sites-chart.tsx`
- `src/components/statistics/day-of-week-chart.tsx`
- `src/components/statistics/time-of-day-chart.tsx`
- `src/lib/statistics.ts`
- `src/lib/statistics.test.ts`

## Files to Modify

- `src/dto/index.ts` (add schemas)
- `src/background.ts` (track block attempts)
- `src/options/page.tsx` (add tabs)

## Estimated Timeline

- **Phase 1** (Data Layer): 4-6 hours
- **Phase 2** (UI Foundation): 3-4 hours
- **Phase 3** (Dashboard): 8-10 hours
- **Phase 4** (Polish): 4-6 hours
- **Phase 5** (Testing): 3-4 hours
- **Total**: ~22-30 hours of development

## Success Criteria

- [ ] Users can view comprehensive blocking statistics
- [ ] All charts render correctly with real data
- [ ] Time range and limit selectors work smoothly
- [ ] Clear statistics function works with confirmation
- [ ] Storage usage is displayed accurately
- [ ] Responsive design works on all screen sizes
- [ ] Dark mode is fully supported
- [ ] All tests pass
- [ ] No performance degradation with 1000+ block attempts
