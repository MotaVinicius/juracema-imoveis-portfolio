resource "aws_cloudfront_origin_access_control" "images" {
  name                              = "juracema-images-oac"
  description                       = "Origin Access Control for S3 Images Bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"

}

resource "aws_cloudfront_distribution" "images" {
  enabled = true
  comment = "Distribuicao das imagens dos imoveis"

  origin {
    domain_name              = aws_s3_bucket.images.bucket_regional_domain_name
    origin_id                = "juracema-images-s3"
    origin_access_control_id = aws_cloudfront_origin_access_control.images.id
  }

  default_cache_behavior {
    target_origin_id       = "juracema-images-s3"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  price_class = "PriceClass_100"

  tags = {
    Name          = "juracema-images-cloudfront"
    Project       = "Juracema-System"
    Environment   = "Portfolio"
    ProvisionedBy = "Terraform"
  }
}

resource "aws_s3_bucket_policy" "images_cloudfront" {

  bucket = aws_s3_bucket.images.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid    = "AllowCloudFrontRead"
      Effect = "Allow"
      Principal = {
        Service = "cloudfront.amazonaws.com"
      }

      Action   = "s3:GetObject"
      Resource = "${aws_s3_bucket.images.arn}/imoveis/*"
      Condition = {
        StringEquals = {
          "AWS:SourceArn" = aws_cloudfront_distribution.images.arn

        }

      }

      }

    ]

  })

}