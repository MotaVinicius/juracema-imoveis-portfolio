resource "aws_iam_role" "ec2" {
  name = "juracema-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Project       = "Juracema-System"
    Environment   = "Portfolio"
    ProvisionedBy = "Terraform"
  }
}

resource "aws_iam_policy" "s3_images" {
  name        = "juracema-s3-images-policy"
  description = "Permite que a aplicacao gerencie imagens no bucket S3"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ]
        Resource = "${aws_s3_bucket.images.arn}/*"
      }
    ]
  })

  tags = {
    Project       = "Juracema-System"
    Environment   = "Portfolio"
    ProvisionedBy = "Terraform"
  }
}

resource "aws_iam_role_policy_attachment" "s3_images" {
  role       = aws_iam_role.ec2.name
  policy_arn = aws_iam_policy.s3_images.arn
}

resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ec2" {
  name = "juracema-ec2-instance-profile"
  role = aws_iam_role.ec2.name
}
