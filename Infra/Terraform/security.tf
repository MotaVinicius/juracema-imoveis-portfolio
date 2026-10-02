resource "aws_security_group" "juracema" {
  name        = "juracema-sg"
  description = "Security group da aplicacao Juracema"
  vpc_id      = aws_vpc.juracema.id

  tags = {
    Name          = "juracema-sg"
    Project       = "Juracema-System"
    Environment   = "Portfolio"
    ProvisionedBy = "Terraform"
  }
}

resource "aws_vpc_security_group_ingress_rule" "ssh" {
  security_group_id = aws_security_group.juracema.id
  description       = "Permitir acesso SSH somente administrador"
  cidr_ipv4         = var.admin_ip_cidr
  from_port         = 22
  to_port           = 22
  ip_protocol       = "tcp"
}

resource "aws_vpc_security_group_ingress_rule" "http" {
  security_group_id = aws_security_group.juracema.id
  description       = "Permitir acesso HTTP"
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 80
  to_port           = 80
  ip_protocol       = "tcp"
}

resource "aws_vpc_security_group_ingress_rule" "https" {
  security_group_id = aws_security_group.juracema.id
  description       = "Permitir acesso HTTPS"
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 443
  to_port           = 443
  ip_protocol       = "tcp"
}

resource "aws_vpc_security_group_egress_rule" "all_outbound" {
  security_group_id = aws_security_group.juracema.id
  description       = "Permitir todo o trafego de saida"
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}
