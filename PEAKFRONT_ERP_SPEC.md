# PEAKFRONT ERP
## Master Development Specification

**Company:** Peakfront Equipment Rental LLC SPC  
**Website:** https://peakfront.ae/  
**Application:** Existing Next.js website  
**Database:** Existing Supabase project  
**Development environment:** Cursor

---

# 1. PROJECT OBJECTIVE

Develop a complete, scalable business management and ERP-style system inside the existing Peakfront admin area.

The system must manage the complete business lifecycle:

Customer → Enquiry → Supplier Sourcing → Quotation → Project → Equipment Booking → Procurement → Delivery → Invoice → Payment → Project Completion → Profitability Report.

The system must support:

- Owned equipment.
- Third-party rental equipment.
- Multiple suppliers.
- Multiple clients and contacts.
- Multiple employees with different permissions.
- Active and completed projects.
- Full operational financial tracking.
- Historical records and reporting.

# 2. EXISTING SYSTEM PROTECTION

Before development:

1. Inspect the entire existing repository.
2. Inspect the existing Supabase database scripts.
3. Inspect existing API routes and server-side Supabase clients.
4. Inspect the existing `/manage` interface.
5. Inspect the existing `/admin` Decap CMS.
6. Identify all existing website functionality.

Preserve:

- Existing public website.
- Existing public equipment catalogue.
- Existing public portfolio.
- Existing `public.projects` table.
- Existing `project-images` storage bucket.
- Existing Decap CMS.
- Existing website quotation email workflow.

The operational project management module must use a new `rental_projects` table.

Do not automatically import, modify or delete existing website records.

# 3. APPLICATION STRUCTURE

Build the ERP under `/manage`.

Required modules:

1. Dashboard
2. CRM / Clients
3. Equipment
4. Suppliers
5. Supplier Rates
6. Enquiries
7. Quotations
8. Projects
9. Bookings and Deployment
10. Procurement
11. Finance
12. Documents
13. Reports
14. Staff and Permissions
15. Settings

Use a consistent sidebar, page headers, search, filters, forms, tables and detail pages.

# 4. DATABASE ARCHITECTURE

Use separate relational tables with UUID primary keys, foreign keys, indexes, timestamps and appropriate constraints.

Required database groups:

STAFF:
- staff_profiles
- staff_roles
- staff_permissions
- staff_role_permissions

CLIENTS:
- clients
- client_contacts
- client_locations
- client_notes
- client_equipment_interests

EQUIPMENT:
- equipment_categories
- equipment
- equipment_specifications
- equipment_assets
- equipment_images
- equipment_documents
- equipment_maintenance

SUPPLIERS:
- suppliers
- supplier_contacts
- supplier_locations
- supplier_equipment
- supplier_rates

SALES:
- enquiries
- enquiry_items
- enquiry_supplier_requests
- enquiry_offers
- quotations
- quotation_versions
- quotation_items

PROJECTS:
- rental_projects
- project_equipment
- project_milestones
- project_logs

OPERATIONS:
- equipment_bookings
- equipment_deployments
- delivery_notes
- collection_records

PROCUREMENT:
- purchase_orders
- purchase_order_items

FINANCE:
- customer_invoices
- customer_invoice_items
- customer_payments
- payment_allocations
- supplier_bills
- supplier_bill_items
- supplier_payments
- expenses
- expense_categories

DOCUMENTS:
- documents
- document_links

SYSTEM:
- activity_logs
- notifications
- system_settings

Use numeric(12,2) for financial amounts and AED as the default currency.

All important business records must have created_at, updated_at and created_by where appropriate.

Use archived_at for master data archiving.

Never hard-delete issued quotations, purchase orders, invoices, payments or completed projects.

Maintain historical snapshots of rates and issued commercial documents.

# 5. PHASE 1 — SECURITY AND FOUNDATION

Implement:

- Supabase Auth.
- Invite-only staff registration.
- Login and logout.
- Password reset.
- Staff profiles.
- Role-based access control.
- Server-side permission verification.
- Protected `/manage` pages.
- Protected API routes.
- Secure session cookies.
- Activity logging.

Roles:

- Super Admin
- Admin
- Sales
- Operations
- Procurement
- Finance
- Viewer

Secure the existing project management API as well.

Never expose the service-role key in frontend code.

Use authenticated server-side access and explicit authorization checks. Prefer user-scoped database access with RLS where practical. Any service-role operations must remain server-only and require explicit staff authorization.

Acceptance criteria:

- Unauthenticated users cannot access staff pages.
- Unauthenticated users cannot call protected APIs.
- Staff cannot access unauthorized modules.
- Super Admin can manage staff permissions.
- Existing public pages continue working.

# 6. PHASE 2 — MASTER DATA

Build Equipment Management:

- Equipment categories.
- Equipment catalogue.
- Equipment specifications.
- Owned equipment assets.
- Supplier-provided equipment.
- Images and documents.
- Equipment registration and certificates.
- Equipment availability and status.

Build Supplier Management:

- Company profiles.
- Multiple contacts.
- Supplier locations.
- Supplied equipment.
- Supplier notes.
- Supplier documents.

Build Supplier Rate Management:

- Daily rates.
- Weekly rates.
- Monthly rates.
- Transportation charges.
- Operator charges.
- VAT inclusion.
- Rate validity.
- Rate history.
- Supplier comparison.

A new supplier rate must preserve the previous rate history.

Build Client Management:

- Company profiles.
- Multiple contact persons.
- Multiple locations.
- Industry.
- Trade licence.
- Equipment interests.
- Notes and communication history.

Acceptance criteria:

- Full CRUD for authorized users.
- Fast search and filtering.
- Relationships between suppliers and equipment work correctly.
- Historical rates remain available.
- Master records can be archived.

# 7. PHASE 3 — SALES AND CRM

Build Enquiry Management.

Each enquiry should include:

- Unique enquiry reference.
- Client.
- Contact person.
- Equipment requirements.
- Quantity.
- Specifications.
- Project location.
- Required date.
- Rental duration.
- Operator requirement.
- Transportation requirement.
- Notes.
- Status.

Build Supplier Offer Management.

Allow multiple suppliers to submit prices against the same enquiry.

Compare supplier offers by equipment and rental duration.

Build Quotation Management.

Each quotation must support:

- Unique quotation reference.
- Client details.
- Multiple equipment items.
- Quantity.
- Daily, weekly and monthly pricing.
- Transportation.
- Waiting charges.
- Additional charges.
- Discounts.
- VAT.
- Terms and conditions.
- Validity date.
- PDF generation.
- Version history.
- Acceptance and rejection tracking.

Do not overwrite previously issued quotation versions.

# 8. PHASE 4 — PROJECT MANAGEMENT

Build a complete operational project management module.

Every project must have:

- Unique project reference.
- Client.
- Project name.
- Project location.
- Project manager.
- Approved quotation.
- Contract value.
- Start date.
- Expected end date.
- Actual completion date.
- Equipment requirements.
- Suppliers.
- Purchase orders.
- Project documents.
- Customer invoices.
- Supplier costs.
- Expenses.
- Payment status.
- Profitability.

Project statuses:

- New
- Planning
- Quotation Submitted
- Awarded
- Mobilization
- In Progress
- On Hold
- Completed
- Cancelled

Build separate views:

- All Projects
- Active Projects
- Upcoming Projects
- On Hold
- Completed Projects
- Cancelled Projects

Completed projects must remain searchable permanently.

A completed project should retain its original quotations, purchase orders, deployment history, invoices, payments, supplier costs and final profitability.

Do not delete or overwrite historical project information when closing a project.

Build project timeline and activity history.

# 9. PHASE 5 — EQUIPMENT BOOKINGS AND OPERATIONS

Implement:

- Equipment reservations.
- Availability tracking.
- Deployment scheduling.
- Delivery records.
- Collection records.
- Equipment location.
- Operator and driver information.
- Rental extensions.
- Return confirmation.

Support both owned assets and supplier-sourced equipment.

Prevent conflicting reservations for the same owned asset.

For third-party equipment, distinguish requested availability from supplier-confirmed availability.

# 10. PHASE 6 — PROCUREMENT

Build Purchase Order Management.

Each purchase order must include:

- Unique PO reference.
- Supplier.
- Related project.
- Related enquiry or quotation.
- Equipment.
- Rental period.
- Quantity.
- Agreed supplier rates.
- Transportation.
- Additional charges.
- VAT.
- Total amount.
- Supplier confirmation.
- Delivery status.
- Supporting documents.

Allow purchase order PDF generation.

Retain all approved purchase order versions and amendments.

# 11. PHASE 7 — FINANCE

Build Customer Invoicing:

- Invoice number.
- Client.
- Related project.
- Invoice date.
- Due date.
- Invoice items.
- VAT.
- Total.
- Payment status.
- Supporting documents.

Build Customer Payments:

- Payment date.
- Amount.
- Payment method.
- Reference.
- Bank details or transaction reference.
- Invoice allocation.

Build Supplier Bills:

- Supplier.
- Related purchase order.
- Project.
- Invoice number.
- Invoice date.
- Due date.
- Amount.
- VAT.
- Payment status.

Build Supplier Payments:

- Supplier.
- Payment date.
- Amount.
- Reference.
- Bill allocation.

Build Expense Management:

- Expense category.
- Description.
- Amount.
- Date.
- Project allocation.
- Receipt attachment.

Build financial reports:

- Customer receivables.
- Supplier payables.
- Project revenue.
- Project costs.
- Project profitability.
- Monthly revenue.
- Monthly expenses.
- Outstanding payments.
- VAT summaries.

Implement configurable VAT settings and appropriate financial validation.

Do not allow issued invoices or completed payment transactions to be silently edited or deleted. Use adjustments and credit notes where required.

# 12. PHASE 8 — DOCUMENT MANAGEMENT

Create a centralized document library.

Support:

- Trade licences.
- Insurance.
- Mulkiya.
- Third-party inspection certificates.
- Operator licences.
- IPAF certificates.
- LPOs.
- Quotations.
- Purchase orders.
- Invoices.
- Delivery notes.
- Completion certificates.
- Project photos.

Link documents to their relevant client, supplier, equipment, project or transaction.

Use private Supabase Storage buckets and signed URLs.

Implement document expiry reminders.

# 13. PHASE 9 — DASHBOARD AND REPORTING

Create a dashboard with:

- Total active clients.
- Total suppliers.
- Equipment catalogue.
- Owned equipment.
- Active projects.
- Completed projects.
- Pending quotations.
- Equipment currently deployed.
- Upcoming equipment returns.
- Customer outstanding balances.
- Supplier outstanding balances.
- Monthly revenue.
- Monthly expenses.
- Project profitability.

Reports must support:

- Date filtering.
- Client filtering.
- Supplier filtering.
- Equipment filtering.
- Project status filtering.
- Excel/CSV export.
- PDF or print-ready output.

# 14. PHASE 10 — TESTING AND PRODUCTION

Test:

- Authentication.
- Every role and permission.
- CRUD operations.
- Database relationships.
- Search and filters.
- Financial calculations.
- VAT calculations.
- Historical rate records.
- Quotation revisions.
- Project completion.
- Equipment availability.
- Invoice payment allocation.
- Document uploads.
- Reports and exports.

Verify that the public website, public catalogue, public portfolio and Decap CMS remain unaffected.

Create database backups and a rollback plan before production migrations.

# 15. DEVELOPMENT RULES

- Work in small, reviewable phases.
- Do not implement all modules in one operation.
- Inspect existing code before changing it.
- Reuse existing project conventions.
- Do not duplicate existing functionality.
- Do not change public website content without approval.
- Use database migrations for schema changes.
- Never put secret credentials in client-side code.
- Use reusable components.
- Implement proper loading, empty and error states.
- Validate all user input.
- Keep an audit trail for important changes.
- Test every completed phase before moving to the next.
- Never overwrite production data without explicit approval.

# 16. FINAL DELIVERABLE

A fully integrated Peakfront Business Management System inside the existing `/manage` area, with secure multi-user access, connected business records, complete project history, operational finance, document management and reporting.

The system must be maintainable, scalable and safe for real business use.