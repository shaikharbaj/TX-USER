///////////////////////////// START SERIAL NUMBER ARRAY /////////////////////////
export const SERIAL_NUMBER_CONFIGURATION_ARR = [
  {
    module: "ADMIN_USER",
    alias: "EMP",
    initial_number: 1,
    current_number: 2,
  },
  {
    module: "SELLER_USER",
    alias: "SLR",
    initial_number: 1,
    current_number: 2,
  },
  {
    module: "BUYER_USER",
    alias: "BYR",
    initial_number: 1,
    current_number: 1,
  },
  {
    module: "FINANCIER_USER",
    alias: "FNC",
    initial_number: 1,
    current_number: 2,
  },
];
///////////////////////////// END SERIAL NUMBER ARRAY /////////////////////////

///////////////////////////// START USER ARRAY /////////////////////////
export const USER_ARR = [
  {
    unique_id: "ADM-001",
    email: "admin@gmail.com",
    first_name: "Sohel",
    middle_name: "Samshuddin",
    last_name: "Patel",
    mobile_number: "8766409349",
    pan_card_number: "123456789",
    status: "ACTIVE",
    user_type: "ADMIN",
  },
  {
    unique_id: "SLR-001",
    email: "seller@gmail.com",
    first_name: "Maureen",
    middle_name: "M.",
    last_name: "Cooper",
    mobile_number: "412-833-2544",
    pan_card_number: "123456789",
    status: "ACTIVE",
    user_type: "SELLER",
  },
  {
    unique_id: "BYR-001",
    email: "buyer@gmail.com",
    first_name: "Delores",
    middle_name: "J.",
    last_name: "Gunter",
    mobile_number: "402-296-2352",
    pan_card_number: "123456789",
    status: "ACTIVE",
    user_type: "BUYER",
  },
  {
    unique_id: "FNC-001",
    email: "financier@gmail.com",
    first_name: "John",
    middle_name: "A.",
    last_name: "Doe",
    mobile_number: "555-123-4567",
    pan_card_number: "987654321",
    status: "ACTIVE",
    user_type: "FINANCIER",
  },
];
///////////////////////////// END USER ARRAY /////////////////////////

///////////////////////////// START ROLE ARRAY /////////////////////////
export const ROLE_ARR = [
  {
    role_name: "Admin",
    slug: "admin",
    description: "This role belongs to the administrator",
    is_active: true,
  },
];
///////////////////////////// END ROLE ARRAY /////////////////////////

///////////////////////////// START PERMISSION ARRAY /////////////////////////
export const PERMISSION_ARR = [
  ///////////////////// START COUNTRY //////////////////////////////
  {
    permissions_name: "List Country",
    slug: "list_country",
    description: "This permission allow logged in user to view country list",
    module: "country",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Add Country",
    slug: "add_country",
    description: "This permission allow logged in user to add country",
    module: "country",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Update Country",
    slug: "update_country",
    description: "This permission allow logged in user to update country",
    module: "country",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Delete Country",
    slug: "delete_country",
    description: "This permission allow logged in user to delete country",
    module: "country",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Restore Country",
    slug: "restore_country",
    description:
      "This permission allow logged in user to restore deleted country",
    module: "country",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Import Country",
    slug: "import_country",
    description: "This permission allow logged in user to import country",
    module: "country",
    is_active: true,
    created_by: 1,
  },
  ///////////////////// END COUNTRY //////////////////////////////

  ///////////////////// START STATE //////////////////////////////
  {
    permissions_name: "List State",
    slug: "list_state",
    description: "This permission allow logged in user to view state list",
    module: "state",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Add State",
    slug: "add_state",
    description: "This permission allow logged in user to add state",
    module: "state",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Update State",
    slug: "update_state",
    description: "This permission allow logged in user to update state",
    module: "state",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Delete State",
    slug: "delete_state",
    description: "This permission allow logged in user to delete state",
    module: "state",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Restore State",
    slug: "restore_state",
    description:
      "This permission allow logged in user to restore deleted state",
    module: "state",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Import State",
    slug: "import_state",
    description: "This permission allow logged in user to import state",
    module: "state",
    is_active: true,
    created_by: 1,
  },
  ///////////////////// END STATE //////////////////////////////

  ///////////////////// START CITY //////////////////////////////
  {
    permissions_name: "List City",
    slug: "list_city",
    description: "This permission allow logged in user to view city list",
    module: "city",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Add City",
    slug: "add_city",
    description: "This permission allow logged in user to add city",
    module: "city",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Update City",
    slug: "update_city",
    description: "This permission allow logged in user to update city",
    module: "city",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Delete City",
    slug: "delete_city",
    description: "This permission allow logged in user to delete city",
    module: "city",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Restore City",
    slug: "restore_city",
    description: "This permission allow logged in user to restore deleted city",
    module: "city",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Import City",
    slug: "import_city",
    description: "This permission allow logged in user to import city",
    module: "city",
    is_active: true,
    created_by: 1,
  },
  ///////////////////// END CITY //////////////////////////////

  ///////////////////// START ROLE //////////////////////////////
  {
    permissions_name: "List Role",
    slug: "list_role",
    description: "This permission allow logged in user to view role list",
    module: "role",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Add Role",
    slug: "add_role",
    description: "This permission allow logged in user to add role",
    module: "role",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Update Role",
    slug: "update_role",
    description: "This permission allow logged in user to update role",
    module: "role",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Delete Role",
    slug: "delete_role",
    description: "This permission allow logged in user to delete role",
    module: "role",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Restore role",
    slug: "restore_role",
    description: "This permission allow logged in user to restore deleted role",
    module: "role",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Import Role",
    slug: "import_role",
    description: "This permission allow logged in user to import role",
    module: "role",
    is_active: true,
    created_by: 1,
  },
  ///////////////////// END ROLE //////////////////////////////

  ///////////////////// START BRAND //////////////////////////////
  {
    permissions_name: "List Brand",
    slug: "list_brand",
    description: "This permission allow logged in user to view brand list",
    module: "brand",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Add Brand",
    slug: "add_brand",
    description: "This permission allow logged in user to add brand",
    module: "brand",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Update Brand",
    slug: "update_brand",
    description: "This permission allow logged in user to update brand",
    module: "brand",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Delete Brand",
    slug: "delete_brand",
    description: "This permission allow logged in user to delete brand",
    module: "brand",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Restore Brand",
    slug: "restore_brand",
    description:
      "This permission allow logged in user to restore deleted brand",
    module: "brand",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Import Brand",
    slug: "import_brand",
    description: "This permission allow logged in user to import brand",
    module: "brand",
    is_active: true,
    created_by: 1,
  },
  ///////////////////// END BRAND //////////////////////////////

  ///////////////////// START TAX //////////////////////////////
  {
    permissions_name: "List Tax",
    slug: "list_tax",
    description: "This permission allow logged in user to view tax list",
    module: "tax",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Add Tax",
    slug: "add_tax",
    description: "This permission allow logged in user to add tax",
    module: "tax",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Update Tax",
    slug: "update_tax",
    description: "This permission allow logged in user to update tax",
    module: "tax",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Delete Tax",
    slug: "delete_tax",
    description: "This permission allow logged in user to delete tax",
    module: "tax",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Restore Tax",
    slug: "restore_tax",
    description: "This permission allow logged in user to restore deleted tax",
    module: "tax",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Import Tax",
    slug: "import_tax",
    description: "This permission allow logged in user to import tax",
    module: "tax",
    is_active: true,
    created_by: 1,
  },
  ///////////////////// END TAX //////////////////////////////

  ///////////////////// START ADMIN USER //////////////////////////////
  {
    permissions_name: "List Admin User",
    slug: "list_admin_user",
    description: "This permission allow logged in user to view admin user list",
    module: "admin_user",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Add Admin User",
    slug: "add_admin_user",
    description: "This permission allow logged in user to add admin user",
    module: "admin_user",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Update Admin User",
    slug: "update_admin_user",
    description: "This permission allow logged in user to update admin user",
    module: "admin_user",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Delete Admin User",
    slug: "delete_admin_user",
    description: "This permission allow logged in user to delete admin user",
    module: "admin_user",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Restore Admin User",
    slug: "restore_admin_user",
    description:
      "This permission allow logged in user to restore deleted admin user",
    module: "admin_user",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Import Admin User",
    slug: "import_admin_user",
    description: "This permission allow logged in user to import admin user",
    module: "admin_user",
    is_active: true,
    created_by: 1,
  },
  ///////////////////// END ADMIN USER //////////////////////////////

  ///////////////////// START USER ADDRESS //////////////////////////////
  {
    permissions_name: "List User Address",
    slug: "list_user_address",
    description:
      "This permission allow logged in user to view user address list",
    module: "user_address",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Add User Address",
    slug: "add_user_address",
    description: "This permission allow logged in user to add user address",
    module: "user_address",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Update User Address",
    slug: "update_user_address",
    description: "This permission allow logged in user to update user address",
    module: "user_address",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Delete User Address",
    slug: "delete_user_address",
    description: "This permission allow logged in user to delete user address",
    module: "user_address",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Restore User Address",
    slug: "restore_user_address",
    description:
      "This permission allow logged in user to restore deleted user address",
    module: "user_address",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Import User Address",
    slug: "import_user_address",
    description: "This permission allow logged in user to import user address",
    module: "user_address",
    is_active: true,
    created_by: 1,
  },
  ///////////////////// END USER ADDRESSS //////////////////////////////

  ///////////////////// START CMS //////////////////////////////
  {
    permissions_name: "List Cms",
    slug: "list_cms",
    description: "This permission allow logged In user to view cms list",
    module: "cms",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Add Cms",
    slug: "add_cms",
    description: "This permission allow logged In user to add new cms",
    module: "cms",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Update Cms",
    slug: "update_cms",
    description: "This permission allow logged In user to update existing cms",
    module: "cms",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Delete Cms",
    slug: "delete_cms",
    description: "This permission allow logged In user to delete existing cms",
    module: "cms",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Restore Cms",
    slug: "restore_cms",
    description: "This permission allow logged in user to restore deleted cms",
    module: "cms",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Import Cms",
    slug: "import_cms",
    description: "This permission allow logged in user to import cms",
    module: "cms",
    is_active: true,
    created_by: 1,
  },
  ///////////////////// END CMS //////////////////////////////

  ///////////////////// START CONTACT US //////////////////////////////
  {
    permissions_name: "List Contact Us",
    slug: "list_contact_us",
    description: "This permission allow logged in user to view contact us list",
    module: "contact_us",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Add Contact Us",
    slug: "add_contact_us",
    description: "This permission allow logged in user to add contact us",
    module: "contact_us",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Delete Contact Us",
    slug: "delete_contact_us",
    description: "This permission allow logged in user to delete contact us",
    module: "contact_us",
    is_active: true,
    created_by: 1,
  },
  ///////////////////// END CONTACT US //////////////////////////////

  ///////////////////// START TESTIMONIAL //////////////////////////////
  {
    permissions_name: "List testimonial",
    slug: "list_testimonial",
    description:
      "This permission allow logged In user to view testimonial list",
    module: "testimonial",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Add testimonial",
    slug: "add_testimonial",
    description: "This permission allow logged In user to add new testimonial",
    module: "testimonial",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Update testimonial",
    slug: "update_testimonial",
    description:
      "This permission allow logged In user to update existing testimonial",
    module: "testimonial",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Delete testimonial",
    slug: "delete_testimonial",
    description:
      "This permission allow logged In user to delete existing testimonial",
    module: "testimonial",
    is_active: true,
    created_by: 1,
  },
  ///////////////////// END TESTIMONIAL //////////////////////////////

  ///////////////////// START INDUSTRY //////////////////////////////
  {
    permissions_name: "List Industry",
    slug: "list_industry",
    description: "This permission allow logged In user to view industry list",
    module: "industry",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Add Industry",
    slug: "add_industry",
    description: "This permission allow logged In user to add new industry",
    module: "industry",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Update Industry",
    slug: "update_industry",
    description:
      "This permission allow logged In user to update existing industry",
    module: "industry",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Delete Industry",
    slug: "delete_industry",
    description:
      "This permission allow logged In user to delete existing industry",
    module: "industry",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Restore Industry",
    slug: "restore_industry",
    description:
      "This permission allow logged in user to restore deleted industry",
    module: "industry",
    is_active: true,
    created_by: 1,
  },
  ///////////////////// END INDUSTRY //////////////////////////////

  ///////////////////// START FAQ //////////////////////////////
  {
    permissions_name: "List Faq",
    slug: "list_faq",
    description: "This permission allow logged in user to view faq list",
    module: "faq",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Add Faq",
    slug: "add_faq",
    description: "This permission allow logged in user to add faq",
    module: "faq",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Update Faq",
    slug: "update_faq",
    description: "This permission allow logged in user to update faq",
    module: "faq",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Delete Faq",
    slug: "delete_faq",
    description: "This permission allow logged in user to delete faq",
    module: "faq",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Restore Faq",
    slug: "restore_faq",
    description: "This permission allow logged in user to restore deleted faq",
    module: "faq",
    is_active: true,
    created_by: 1,
  },
  ///////////////////////////// END FAQ /////////////////////////

  ///////////////////// START SOCIAL MEDIA //////////////////////////////
  {
    permissions_name: "List Social Media",
    slug: "list_social_media",
    description:
      "This permission allow logged in user to view social media list",
    module: "social_media",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Add Social Media",
    slug: "add_social_media",
    description: "This permission allow logged in user to add social media",
    module: "social_media",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Update Social Media",
    slug: "update_social_media",
    description: "This permission allow logged in user to update social media",
    module: "social_media",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Delete Social Media",
    slug: "delete_social_media",
    description: "This permission allow logged in user to delete social media",
    module: "social_media",
    is_active: true,
    created_by: 1,
  },
  ///////////////////////////// END SOCIAL MEDIA /////////////////////////

  ///////////////////// START CATEGORY //////////////////////////////
  {
    permissions_name: "List Category",
    slug: "list_category",
    description: "This permission allow logged in user to view category list",
    module: "category",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Add Category",
    slug: "add_category",
    description: "This permission allow logged in user to add category",
    module: "category",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Update Category",
    slug: "update_category",
    description: "This permission allow logged in user to update category",
    module: "category",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Delete Category",
    slug: "delete_category",
    description: "This permission allow logged in user to delete category",
    module: "category",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Restore Category",
    slug: "restore_category",
    description:
      "This permission allow logged in user to restore deleted category",
    module: "category",
    is_active: true,
    created_by: 1,
  },
  ///////////////////////////// END CATEGORY /////////////////////////

  ///////////////////// START GLOBAL SETTING  //////////////////////////////
  {
    permissions_name: "List Global Setting",
    slug: "list_global_setting",
    description:
      "This permission allow logged in user to view global setting list",
    module: "global_setting",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Add Global Setting",
    slug: "add_global_setting",
    description: "This permission allow logged in user to add global setting",
    module: "global_setting",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Update Global Setting",
    slug: "update_global_setting",
    description:
      "This permission allow logged in user to update global setting",
    module: "global_setting",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Delete Global Setting",
    slug: "delete_global_setting",
    description:
      "This permission allow logged in user to delete global setting",
    module: "global_setting",
    is_active: true,
    created_by: 1,
  },
  ///////////////////////////// END SOCIAL MEDIA /////////////////////////

  ///////////////////// START ATTRIBUTE //////////////////////////////
  {
    permissions_name: "List Attribute",
    slug: "list_attribute",
    description: "This permission allow logged in user to view attribute list",
    module: "attribute",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Add Attribute",
    slug: "add_attribute",
    description: "This permission allow logged in user to add attribute",
    module: "attribute",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Update Attribute",
    slug: "update_attribute",
    description: "This permission allow logged in user to update attribute",
    module: "attribute",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Delete Attribute",
    slug: "delete_attribute",
    description: "This permission allow logged in user to delete attribute",
    module: "attribute",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Restore Attribute",
    slug: "restore_attribute",
    description:
      "This permission allow logged in user to restore deleted attribute",
    module: "attribute",
    is_active: true,
    created_by: 1,
  },
  ///////////////////////////// END ATTRIBUTE /////////////////////////

  ///////////////////// START ATTRIBUTE VALUE //////////////////////////////
  {
    permissions_name: "List Attribute Value",
    slug: "list_attribute_value",
    description:
      "This permission allow logged in user to view attribute value list",
    module: "attribute_value",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Add Attribute Value",
    slug: "add_attribute_value",
    description: "This permission allow logged in user to add attribute value",
    module: "attribute_value",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Update Attribute Value",
    slug: "update_attribute_value",
    description:
      "This permission allow logged in user to update attribute value",
    module: "attribute_value",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Delete Attribute Value",
    slug: "delete_attribute_value",
    description:
      "This permission allow logged in user to delete attribute value",
    module: "attribute_value",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Restore Attribute Value",
    slug: "restore_attribute_value",
    description:
      "This permission allow logged in user to restore deleted attribute value",
    module: "attribute_value",
    is_active: true,
    created_by: 1,
  },
  ///////////////////////////// END ATTRIBUTE VALUE /////////////////////////

  ///////////////////// START UOM //////////////////////////////
  {
    permissions_name: "List Uom",
    slug: "list_uom",
    description: "This permission allow logged In user to view uom list",
    module: "uom",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Add Uom",
    slug: "add_uom",
    description: "This permission allow logged In user to add new uom",
    module: "uom",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Update Uom",
    slug: "update_uom",
    description: "This permission allow logged In user to update existing uom",
    module: "uom",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Delete Uom",
    slug: "delete_uom",
    description: "This permission allow logged In user to delete existing uom",
    module: "uom",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Restore Uom",
    slug: "restore_uom",
    description: "This permission allow logged in user to restore deleted uom",
    module: "uom",
    is_active: true,
    created_by: 1,
  },

  ///////////////////// END UOM //////////////////////////////

  ///////////////////// START PRODUCT RATING //////////////////////////////
  {
    permissions_name: "List Product Rating",
    slug: "list_product_rating",
    description:
      "This permission allow logged in user to view product rating list",
    module: "product_rating",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Add Product Rating",
    slug: "add_product_rating",
    description: "This permission allow logged in user to add product rating",
    module: "product_rating",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Update Product Rating",
    slug: "update_product_rating",
    description:
      "This permission allow logged in user to update product rating",
    module: "product_rating",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Delete Product Rating",
    slug: "delete_product_rating",
    description:
      "This permission allow logged in user to delete product rating",
    module: "product_rating",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Restore Product Rating",
    slug: "restore_product_rating",
    description:
      "This permission allow logged in user to restore deleted product rating",
    module: "product_rating",
    is_active: true,
    created_by: 1,
  },

  ///////////////////// END PRODUCT RATING //////////////////////////////

  ///////////////////// START ORDER  //////////////////////////////
  {
    permissions_name: "List Order",
    slug: "list_order",
    description: "This permission allow logged in user to view order list",
    module: "order",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Add Order",
    slug: "add_order",
    description: "This permission allow logged in user to add order",
    module: "order",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Update Order",
    slug: "update_order",
    description: "This permission allow logged in user to update order",
    module: "order",
    is_active: true,
    created_by: 1,
  },

  ///////////////////// END ORDER  //////////////////////////////

  ///////////////////// START FAQ CATEGORY //////////////////////////////
  {
    permissions_name: "List Faq Category",
    slug: "list_faq_category",
    description:
      "This permission allow logged in user to view faq_category list",
    module: "faq_category",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Add Faq Category",
    slug: "add_faq_category",
    description: "This permission allow logged in user to add faq category",
    module: "faq_category",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Update Faq Category",
    slug: "update_faq_category",
    description: "This permission allow logged in user to update faq category",
    module: "faq_category",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Delete Faq Category",
    slug: "delete_faq_category",
    description: "This permission allow logged in user to delete faq category",
    module: "faq_category",
    is_active: true,
    created_by: 1,
  },
  {
    permissions_name: "Restore Faq Category",
    slug: "restore_faq_category",
    description:
      "This permission allow logged in user to restore deleted faq category",
    module: "faq_category",
    is_active: true,
    created_by: 1,
  },
  ///////////////////////////// END FAQ CATEGORY /////////////////////////
];
///////////////////////////// END PERMISSION ARRAY /////////////////////////

///////////////////////////// START ADDRESS TYPE ARRAY /////////////////////////
export const ADDRESS_TYPE_ARR = [
  {
    address_name: "Home",
    slug: "home",
  },
  {
    address_name: "Appartment",
    slug: "appartment",
  },
  {
    address_name: "Business",
    slug: "business",
  },
  {
    address_name: "Other",
    slug: "other",
  },
];
///////////////////////////// END ADDRESS TYPE ARRAY /////////////////////////
