CREATE TABLE providers (
id INT NOT NULL AUTO_INCREMENT, 
code VARCHAR(3) NOT NULL, 
public_name VARCHAR(50) NOT NULL,
PRIMARY KEY (id),
UNIQUE (code)
);


INSERT INTO providers
(code, public_name)
VALUES
('aws', 'Amazon Web Services'),
('azr', 'Microsoft Azure'),
('gcp', 'Google Cloud Platform');


CREATE TABLE secrets (
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(50) NOT NULL, 
vault_key VARCHAR(200) NOT NULL,
PRIMARY KEY (id),
UNIQUE (vault_key)
);


INSERT INTO secrets 
(name, vault_key) 
VALUES 
('default', 'secret/data/casmi/default');


CREATE TABLE spaces (
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(50) NOT NULL,
secret_id INT NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY (secret_id) REFERENCES secrets(id),
UNIQUE (name)
);


CREATE TABLE space_provider (
id INT NOT NULL AUTO_INCREMENT,
space_id INT NOT NULL,
provider_id INT NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY (space_id) REFERENCES spaces(id),
FOREIGN KEY (provider_id) REFERENCES providers(id),
CONSTRAINT unique_store_provider UNIQUE (space_id, provider_id)
);


CREATE TABLE stores (
id INT NOT NULL AUTO_INCREMENT,
file_count INT NOT NULL,
space_id INT NOT NULL,
provider_id INT NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY (space_id) REFERENCES spaces(id),
FOREIGN KEY (provider_id) REFERENCES providers(id)
);


CREATE TABLE folders (
id INT NOT NULL AUTO_INCREMENT,
provider_key VARCHAR(200) NOT NULL,
store_id INT NOT NULL,
space_id INT NOT NULL,
provider_id INT NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY (store_id) REFERENCES stores(id),
FOREIGN KEY (space_id) REFERENCES spaces(id),
FOREIGN KEY (provider_id) REFERENCES providers(id),
CONSTRAINT unique_store_folders UNIQUE (provider_key, store_id)
);


CREATE TABLE files (
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(50) NOT NULL,
size BIGINT NOT NULL,
provider_key VARCHAR(200) NOT NULL,
folder_id INT NOT NULL,
store_id INT NOT NULL,
space_id INT NOT NULL,
provider_id INT NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY (folder_id) REFERENCES folders(id),
FOREIGN KEY (store_id) REFERENCES stores(id),
FOREIGN KEY (space_id) REFERENCES spaces(id),
FOREIGN KEY (provider_id) REFERENCES providers(id),
CONSTRAINT unique_store_files UNIQUE (provider_key, store_id)
);