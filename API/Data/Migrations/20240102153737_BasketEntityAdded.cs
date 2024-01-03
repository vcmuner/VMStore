using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
	/// <inheritdoc />
	public partial class BasketEntityAdded : Migration
	{
		/// <inheritdoc />
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.AlterColumn<int>(
				name: "QuantityInStock",
				table: "Products",
				type: "INTEGER",
				nullable: false,
				defaultValue: 0,
				oldClrType: typeof(string),
				oldType: "TEXT",
				oldNullable: true);

			migrationBuilder.CreateTable(
				name: "Baskets",
				columns: table => new
				{
					Id = table.Column<int>(type: "INTEGER", nullable: false)
						.Annotation("Sqlite:Autoincrement", true),
					BuyerId = table.Column<int>(type: "INTEGER", nullable: false)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_Baskets", x => x.Id);
				});

			migrationBuilder.CreateTable(
				name: "BasketItems",
				columns: table => new
				{
					Id = table.Column<int>(type: "INTEGER", nullable: false)
						.Annotation("Sqlite:Autoincrement", true),
					Quantity = table.Column<int>(type: "INTEGER", nullable: false),
					ProductId = table.Column<int>(type: "INTEGER", nullable: false),
					BasketId = table.Column<int>(type: "INTEGER", nullable: false)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_BasketItems", x => x.Id);
					table.ForeignKey(
						name: "FK_BasketItems_Baskets_BasketId",
						column: x => x.BasketId,
						principalTable: "Baskets",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade);
					table.ForeignKey(
						name: "FK_BasketItems_Products_ProductId",
						column: x => x.ProductId,
						principalTable: "Products",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade);
				});

			migrationBuilder.CreateIndex(
				name: "IX_BasketItems_BasketId",
				table: "BasketItems",
				column: "BasketId");

			migrationBuilder.CreateIndex(
				name: "IX_BasketItems_ProductId",
				table: "BasketItems",
				column: "ProductId");
		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropTable(
				name: "BasketItems");

			migrationBuilder.DropTable(
				name: "Baskets");

			migrationBuilder.AlterColumn<string>(
				name: "QuantityInStock",
				table: "Products",
				type: "TEXT",
				nullable: true,
				oldClrType: typeof(int),
				oldType: "INTEGER");
		}
	}
}
