resource "aws_route53_zone" "juracema" {
  name = var.domain_name

  tags = {
    Name          = "juracema-imoveis"
    Project       = "Juracema-System"
    Environment   = "Portfolio"
    ProvisionedBy = "Terraform"
  }
}

resource "aws_route53_record" "root" {
  zone_id = aws_route53_zone.juracema.zone_id
  name    = "juracema-imoveis"
  type    = "A"
  ttl     = 300

  records = [
    aws_eip.juracema.public_ip
  ]
}

resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.juracema.zone_id
  name    = "juracema-imoveis"
  type    = "A"
  ttl     = 300

  records = [
    aws_eip.juracema.public_ip
  ]
}


  