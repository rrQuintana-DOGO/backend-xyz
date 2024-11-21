-- CreateTable
CREATE TABLE "client_has_contacts" (
    "id_client_has_contact" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_client" UUID,
    "id_contact" UUID,

    CONSTRAINT "client_has_contacts_pkey" PRIMARY KEY ("id_client_has_contact")
);

-- AddForeignKey
ALTER TABLE "client_has_contacts" ADD CONSTRAINT "client_has_contacts_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "clients"("id_client") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "client_has_contacts" ADD CONSTRAINT "client_has_contacts_id_contact_fkey" FOREIGN KEY ("id_contact") REFERENCES "contacts"("id_contact") ON DELETE NO ACTION ON UPDATE NO ACTION;
