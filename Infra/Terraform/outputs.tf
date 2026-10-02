output "ec2_public_ip" {
  description = "Elastic IP publico da instancia EC2"
  value       = aws_eip.juracema.public_ip
}

output "ec2_private_ip" {
  description = "IP privado da instancia EC2"
  value       = aws_instance.juracema.private_ip
}

output "images_bucket" {
  description = "Bucket S3 utilizado para armazenar imagens"
  value       = aws_s3_bucket.images.bucket
}

output "cloudfront_images_url" {

  description = "URL publica das imagens via CloudFront"
  value       = "https://${aws_cloudfront_distribution.images.domain_name}"

}

output "route53_name_servers" {
  description = "Name servers do Route53"
  value       = aws_route53_zone.juracema.name_servers
}

