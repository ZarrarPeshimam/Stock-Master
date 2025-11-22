# Stock-Master

## Team Details
- Zarrar Peshimam
- Prinka Devi
- Floyd Pinto
- Piyush Chintal

**Reviewer:** Aman Patel (ampa)

---

## Project Overview

StockMaster is a comprehensive Inventory Management System (IMS) that digitizes and streamlines all stock-related operations within a business. It replaces manual registers, Excel sheets, and scattered tracking methods with a centralized, real-time, easy-to-use application.

### Tech Stack
- **Backend:** Django + Django REST Framework
- **Frontend:** React Native
- **Database:** PostgreSQL (production) / SQLite (development)

---

## Documentation

### 📋 Getting Started
1. **[QUICK_START.md](./QUICK_START.md)** - Quick setup guide for both backend and frontend
2. **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** - Detailed step-by-step implementation plan
3. **[PROJECT_CHECKLIST.md](./PROJECT_CHECKLIST.md)** - Track your progress with this checklist

### 📊 Technical Documentation
4. **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Complete database schema and relationships

### 📦 Dependencies
5. **[requirements.txt](./requirements.txt)** - Python dependencies for backend

---

## Project Structure

```
Stock-Master/
├── stockmaster_backend/     # Django backend (to be created)
│   ├── accounts/            # Authentication & user management
│   ├── products/            # Product management
│   ├── warehouses/         # Warehouse & location management
│   ├── operations/          # Receipts, Deliveries, Transfers, Adjustments
│   └── dashboard/           # Dashboard APIs
│
├── StockMasterApp/          # React Native frontend (to be created)
│   ├── src/
│   │   ├── screens/         # All app screens
│   │   ├── components/      # Reusable components
│   │   ├── navigation/      # Navigation setup
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   └── App.tsx
│
└── Documentation files
```

---

## Core Features

### 1. Authentication
- User signup/login
- OTP-based password reset
- Secure session management

### 2. Dashboard
- Real-time KPIs (Total Products, Low Stock, Pending Operations)
- Dynamic filters (document type, status, warehouse, category)
- Quick navigation to all modules

### 3. Product Management
- Create/update products with SKU, category, unit of measure
- Stock availability per location
- Product categories
- Reordering rules

### 4. Operations
- **Receipts:** Incoming stock from vendors
- **Delivery Orders:** Outgoing stock to customers
- **Internal Transfers:** Move stock between locations
- **Stock Adjustments:** Fix mismatches between recorded and physical stock

### 5. Move History
- Complete audit trail of all stock movements
- Color-coded IN/OUT moves
- Advanced filtering and search

### 6. Multi-Warehouse Support
- Multiple warehouses
- Multiple locations per warehouse
- Location-based stock tracking

---

## Implementation Roadmap

### Phase 1: Setup & Foundation (Week 1-2)
- Project initialization
- Database models
- Basic configuration

### Phase 2: Backend APIs (Week 3-4)
- Authentication APIs
- CRUD operations for all entities
- Operations APIs
- Dashboard APIs

### Phase 3: Frontend Core (Week 5-6)
- Navigation setup
- Authentication screens
- Dashboard
- Product management

### Phase 4: Operations (Week 7-8)
- Receipts, Deliveries, Transfers
- Stock adjustments
- Move history

### Phase 5: Polish & Deploy (Week 9-10)
- Testing
- Bug fixes
- Deployment

---

## Quick Start

1. **Read the Quick Start Guide:**
   ```bash
   cat QUICK_START.md
   ```

2. **Set up Backend:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Set up Frontend:**
   ```bash
   npx react-native init StockMasterApp --template react-native-template-typescript
   cd StockMasterApp
   npm install
   ```

4. **Follow the Implementation Plan:**
   - Start with Phase 1 in `IMPLEMENTATION_PLAN.md`
   - Use `PROJECT_CHECKLIST.md` to track progress
   - Refer to `DATABASE_SCHEMA.md` for data modeling

---

## Key Concepts

### Reference Generation
All operations have auto-generated references:
- Format: `{WarehouseCode}/{OperationType}/{Counter}`
- Examples: `WH/IN/0001`, `WH/OUT/0001`, `WH/INT/0001`, `WH/ADJ/0001`

### Status Workflows
- **Receipt:** Draft → Ready → Done
- **Delivery:** Draft → Waiting → Ready → Done
- **Transfer:** Draft → Ready → Done

### Stock Management
- Stock is tracked per product per location
- Every stock change creates a MoveHistory entry
- Reserved quantity prevents double-booking

---

## Contributing

1. Create a feature branch
2. Follow the implementation plan
3. Update the checklist as you complete items
4. Test thoroughly before committing
5. Submit for review

---

## Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)

---

## License

[Add your license here]

---

**Happy Coding! 🚀**
