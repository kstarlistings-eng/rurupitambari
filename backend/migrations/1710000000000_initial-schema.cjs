exports.up = (pgm) => {
  pgm.sql(`
    CREATE TYPE user_role AS ENUM ('admin_finance', 'production_operator', 'store_operator');
    CREATE TYPE transfer_status AS ENUM ('pending', 'received');
    CREATE TYPE production_order_status AS ENUM ('pending_transfer', 'transferred', 'dispatched');

    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      role user_role NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE raw_materials (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      material_id VARCHAR(100) NOT NULL UNIQUE,
      material_name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      uom VARCHAR(50) NOT NULL,
      current_quantity NUMERIC(15,4) NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE expenses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      raw_material_id UUID NOT NULL REFERENCES raw_materials(id) ON DELETE CASCADE,
      quantity NUMERIC(15,4) NOT NULL,
      unit_price NUMERIC(15,4) NOT NULL,
      total_cost NUMERIC(15,4) NOT NULL,
      supplier_name VARCHAR(255) NOT NULL,
      supplier_contact VARCHAR(255),
      supplier_address TEXT,
      invoice_reference VARCHAR(255),
      purchase_date DATE NOT NULL,
      created_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE production_orders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      batch_number VARCHAR(100) NOT NULL UNIQUE,
      product_name VARCHAR(255) NOT NULL,
      quantity_produced NUMERIC(15,4) NOT NULL,
      production_date DATE NOT NULL,
      shift VARCHAR(50) NOT NULL,
      supervisor_name VARCHAR(255) NOT NULL,
      machine_line_number VARCHAR(100) NOT NULL,
      status production_order_status NOT NULL DEFAULT 'pending_transfer',
      created_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE production_consumptions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      production_order_id UUID NOT NULL REFERENCES production_orders(id) ON DELETE CASCADE,
      raw_material_id UUID NOT NULL REFERENCES raw_materials(id) ON DELETE CASCADE,
      quantity_consumed NUMERIC(15,4) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE transfers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      production_order_id UUID NOT NULL REFERENCES production_orders(id) ON DELETE CASCADE,
      quantity NUMERIC(15,4) NOT NULL,
      status transfer_status NOT NULL DEFAULT 'pending',
      transferred_at TIMESTAMP NOT NULL DEFAULT NOW(),
      received_at TIMESTAMP,
      received_by UUID REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE finished_goods (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      product_name VARCHAR(255) NOT NULL,
      batch_number VARCHAR(100) NOT NULL UNIQUE,
      quantity_available NUMERIC(15,4) NOT NULL DEFAULT 0,
      production_order_id UUID NOT NULL REFERENCES production_orders(id) ON DELETE CASCADE,
      received_at TIMESTAMP NOT NULL DEFAULT NOW(),
      received_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE sellers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      contact_person VARCHAR(255),
      phone VARCHAR(50),
      email VARCHAR(255),
      address TEXT,
      tax_id VARCHAR(100),
      tier VARCHAR(100) NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE invoices (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      invoice_number VARCHAR(100) NOT NULL UNIQUE,
      seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
      total_amount NUMERIC(15,4) NOT NULL,
      tax NUMERIC(15,4) NOT NULL DEFAULT 0,
      status VARCHAR(50) NOT NULL DEFAULT 'generated',
      created_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE sales_dispatches (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
      finished_good_id UUID NOT NULL REFERENCES finished_goods(id) ON DELETE CASCADE,
      quantity_allocated NUMERIC(15,4) NOT NULL,
      selling_price_per_unit NUMERIC(15,4) NOT NULL,
      order_date DATE NOT NULL,
      batch_number VARCHAR(100) NOT NULL,
      invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
      created_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE INDEX idx_expenses_raw_material_id ON expenses(raw_material_id);
    CREATE INDEX idx_production_consumptions_order_id ON production_consumptions(production_order_id);
    CREATE INDEX idx_transfers_production_order_id ON transfers(production_order_id);
    CREATE INDEX idx_finished_goods_production_order_id ON finished_goods(production_order_id);
    CREATE INDEX idx_sales_dispatches_seller_id ON sales_dispatches(seller_id);
    CREATE INDEX idx_sales_dispatches_finished_good_id ON sales_dispatches(finished_good_id);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS sales_dispatches;
    DROP TABLE IF EXISTS invoices;
    DROP TABLE IF EXISTS sellers;
    DROP TABLE IF EXISTS finished_goods;
    DROP TABLE IF EXISTS transfers;
    DROP TABLE IF EXISTS production_consumptions;
    DROP TABLE IF EXISTS production_orders;
    DROP TABLE IF EXISTS expenses;
    DROP TABLE IF EXISTS raw_materials;
    DROP TABLE IF EXISTS users;

    DROP TYPE IF EXISTS production_order_status;
    DROP TYPE IF EXISTS transfer_status;
    DROP TYPE IF EXISTS user_role;
  `);
};
