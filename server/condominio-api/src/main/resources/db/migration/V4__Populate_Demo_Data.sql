-- V4__Populate_Demo_Data.sql

-- 1. Inserir Condomínio
INSERT INTO Condominium (id_condominium, name, cnpj, balance)
VALUES ('11111111-1111-1111-1111-111111111111', 'Condomínio SmartGate Demo', '00.000.000/0001-99', 10000.00);

-- 2. Inserir Categoria de Gasto (Já corrigido com acento)
INSERT INTO ExpenseCategory (id_category, name, description)
VALUES ('22222222-2222-2222-2222-222222222222', 'Manutenção', 'Gastos gerais e reparos');

-- 3. Inserir Pessoa (O Síndico)
INSERT INTO Person (id_person, full_name, cpf, email)
VALUES ('44444444-4444-4444-4444-444444444444', 'João Síndico', '123.456.789-00', 'sindico@demo.com');

-- 4. Inserir Casa
INSERT INTO House (id_house, house_number, id_condominium, block)
VALUES ('55555555-5555-5555-5555-555555555555', 101, '11111111-1111-1111-1111-111111111111', 'A');

-- 5. Inserir Residente (Vinculando Pessoa e Casa)
INSERT INTO Resident (id_resident, id_person, id_house, date_of_entry)
VALUES ('33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', NOW());

-- 6. Inserir Membro do Comitê (Transformando o residente em Síndico)
INSERT INTO CommitteeMember (id_resident, position, start_date)
VALUES ('33333333-3333-3333-3333-333333333333', 'SINDICO', NOW());

-- 7. (Opcional) Inserir um Gasto de Exemplo já criado
INSERT INTO Expense (id_expense, name, amount, expense_date, status, description, id_category, id_committee_member, id_condominium, created_at)
VALUES (
           UUID(),
           'Jardinagem Inicial',
           150.00,
           CURDATE(),
           'Pago',
           'Corte de grama para a demo',
           '22222222-2222-2222-2222-222222222222',
           '33333333-3333-3333-3333-333333333333',
           '11111111-1111-1111-1111-111111111111',
           NOW()
       );