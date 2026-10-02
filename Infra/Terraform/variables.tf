variable "aws_region" {
  description = "Região da AWS onde a infraestrutura sera provisionada"
  type        = string
  default     = "us-east-2"
}

variable "admin_ip_cidr" {
  description = "CIDR do IP do administrador para acesso SSH"
  type        = string
}

variable "s3_bucket_name" {
  description = "Nome do bucket S3 para armazenamento das imagens"
  type        = string
}

variable "domain_name" {
  description = "Domínio utilizado pela aplicação"
  type        = string
}

variable "ec2_key_name" {
  description = "Nome da chave SSH utilizada pela instância EC2"
  type        = string
}

variable "ssh_public_key_path" {
  description = "Caminho da chave pública SSH utilizada pela EC2"
  type        = string
}