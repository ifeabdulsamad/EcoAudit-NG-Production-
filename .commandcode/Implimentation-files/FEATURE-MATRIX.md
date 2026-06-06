# EcoAudit NG - Feature Matrix

| Feature | Free | Pro (₦3k/mo) | Business (₦8k/mo) |
|---------|:----:|:------------:|:-----------------:|
| **Core Audit** |
| Run energy audit | ✓ | ✓ | ✓ |
| Energy score | ✓ | ✓ | ✓ |
| Basic recommendations | ✓ | ✓ | ✓ |
| Solar merchant matches | ✓ | ✓ | ✓ |
| **Reports** |
| AI-generated report | ✗ | ✓ | ✓ |
| PDF export | ✗ | ✓ | ✓ |
| White label PDF | ✗ | ✗ | ✓ |
| **Storage** |
| Save audits | 1 only | 5 saved | Unlimited |
| Audit history | ✗ | ✓ | ✓ |
| Compare audits | ✗ | ✗ | ✓ |
| **Multi-location** |
| Multiple branches | ✗ | ✗ | ✓ |
| **Team** |
| Team access (3 users) | ✗ | ✗ | ✓ |
| **Extras** |
| Monthly energy email | ✗ | ✗ | ✓ |
| One-time AI report | ₦1,500 | — | — |

**Legend:**
- ✓ = Included
- ✗ = Not available  
- ₦1,500 = One-time purchase option

---

## Implementation in Code

Features are gated using the `useFeatureGate` hook:

```javascript
const { canAccess, canSaveAudit } = useFeatureGate()

// Check specific features
if (canAccess('ai_report')) { ... }
if (canAccess('pdf_export')) { ... }
if (canAccess('save_audit')) { ... }

// Check if user can save more audits
if (canSaveAudit()) { ... }
```

### Available Feature Keys

**Free Tier:**
- `run_audit`
- `energy_score`  
- `recommendations`
- `solar_matches`

**Pro Tier (+ all free):**
- `ai_report`
- `pdf_export`
- `save_audit`
- `audit_history`

**Business Tier (+ all pro):**
- `compare_audits`
- `multiple_locations`
- `team_access`
- `monthly_report`
- `white_label_pdf`

---

## Database Schema for Plans

User plan stored in `profiles` table:
```sql
plan TEXT DEFAULT 'free'  -- 'free' | 'pro' | 'business'
audit_count INTEGER DEFAULT 0
```

Logic:
- Free: `audit_count < 1`
- Pro: `audit_count < 5`  
- Business: unlimited
