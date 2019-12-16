using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace TestTask.Models
{
    public partial class IEIT_TestDBContext : DbContext
    {
        public IEIT_TestDBContext()
        {
        }

        public IEIT_TestDBContext(DbContextOptions<IEIT_TestDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Clients> Clients { get; set; }
        public virtual DbSet<PlanPeriods> PlanPeriods { get; set; }
        public virtual DbSet<PlanSales> PlanSales { get; set; }
        public virtual DbSet<ProdGroups> ProdGroups { get; set; }
        public virtual DbSet<Products> Products { get; set; }
        public virtual DbSet<SaleProducts> SaleProducts { get; set; }
        public virtual DbSet<Sales> Sales { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=DESKTOP-2OMTTU5;Database=IEIT_TestDB;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Clients>(entity =>
            {
                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<PlanPeriods>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.FromDate).HasColumnType("date");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.ToDate).HasColumnType("date");
            });

            modelBuilder.Entity<PlanSales>(entity =>
            {
                entity.HasKey(e => new { e.PeriodId, e.ProdGroupId });

                entity.Property(e => e.PlanAmount).HasColumnType("money");

                entity.HasOne(d => d.Period)
                    .WithMany(p => p.PlanSales)
                    .HasForeignKey(d => d.PeriodId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PlanSales_PeriodId");

                entity.HasOne(d => d.ProdGroup)
                    .WithMany(p => p.PlanSales)
                    .HasForeignKey(d => d.ProdGroupId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PlanSales_ProdGroupId");
            });

            modelBuilder.Entity<ProdGroups>(entity =>
            {
                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<Products>(entity =>
            {
                entity.Property(e => e.DefaultPrice).HasColumnType("money");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.HasOne(d => d.Group)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.GroupId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Products_GroupId");
            });

            modelBuilder.Entity<SaleProducts>(entity =>
            {
                entity.HasKey(e => new { e.SaleId, e.ProductId });

                entity.Property(e => e.ProdAmount)
                    .HasColumnType("money")
                    .HasComputedColumnSql("([ProdCount]*[ProdPrice])");

                entity.Property(e => e.ProdPrice).HasColumnType("money");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.SaleProducts)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SaleProducts_ProductId");

                entity.HasOne(d => d.Sale)
                    .WithMany(p => p.SaleProducts)
                    .HasForeignKey(d => d.SaleId)
                    .HasConstraintName("FK_SaleProducts_SaleId");
            });

            modelBuilder.Entity<Sales>(entity =>
            {
                entity.Property(e => e.SaleDate).HasColumnType("date");

                entity.HasOne(d => d.Client)
                    .WithMany(p => p.Sales)
                    .HasForeignKey(d => d.ClientId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Sales_ClientId");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
