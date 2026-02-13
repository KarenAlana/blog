
-- Criar tabela com novo schema
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  image TEXT NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT NOW(),
  reading_time TEXT DEFAULT '5 min',
  excerpt TEXT NOT NULL,
  conteudo JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_date ON posts(date DESC);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Permitir acesso público para leitura
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are publicly readable" 
ON posts FOR SELECT 
USING (true);

-- Permitir inserção de posts
CREATE POLICY "Posts can be created"
ON posts FOR INSERT
WITH CHECK (true);

-- Permitir atualização de posts
CREATE POLICY "Posts can be updated"
ON posts FOR UPDATE
USING (true)
WITH CHECK (true);

-- Permitir deleção de posts
CREATE POLICY "Posts can be deleted"
ON posts FOR DELETE
USING (true);