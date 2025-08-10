import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigation, Form, useActionData } from "@remix-run/react";
import { prisma } from "~/db.server";
import { Page, Layout, Card, FormLayout, TextField, Checkbox, Button, InlineStack, BlockStack, Inline, Text, Box } from "@shopify/polaris";
import { useState } from "react";

async function getShopFromSessionOrEnv(request: Request) {
  try {
    const mod = await import('~/shopify.server');
    const { admin } = await mod.authenticate(request);
    return admin.session.shop as string;
  } catch {
    return process.env.DEV_STORE || 'dev-shop.myshopify.com';
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const shop = await getShopFromSessionOrEnv(request);
  const bars = await prisma.promoBar.findMany({ where: { shop }, orderBy: { id: "asc" } });
  return json({ bars, shop });
}

export async function action({ request }: ActionFunctionArgs) {
  const shop = await getShopFromSessionOrEnv(request);
  const form = await request.formData();
  const message = String(form.get("message") || "");
  const bgColor = String(form.get("bgColor") || "#111827");
  const textColor = String(form.get("textColor") || "#ffffff");
  const showOnHome = form.get("showOnHome") === "on";
  const showOnProduct = form.get("showOnProduct") === "on";
  const showOnCollection = form.get("showOnCollection") === "on";
  const active = form.get("active") === "on";

  if (!message) {
    return json({ error: "Nachricht ist erforderlich" }, { status: 400 });
  }

  await prisma.promoBar.create({
    data: { shop, message, bgColor, textColor, showOnHome, showOnProduct, showOnCollection, active },
  });
  return redirect(`/`);
}

export default function Index() {
  const { bars } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const nav = useNavigation();
  const submitting = nav.state === "submitting";

  const [message, setMessage] = useState("Kostenloser Versand ab 50€");
  const [bgColor, setBgColor] = useState("#0ea5e9");
  const [textColor, setTextColor] = useState("#0b1320");
  const [showOnHome, setShowOnHome] = useState(true);
  const [showOnProduct, setShowOnProduct] = useState(false);
  const [showOnCollection, setShowOnCollection] = useState(false);
  const [active, setActive] = useState(true);

  return (
    <Page title="Promo Bar Einstellungen">
      <Layout>
        <Layout.Section>
          <Card>
            <Box padding="400">
              <Form method="post" replace>
                <FormLayout>
                  <TextField label="Nachricht" name="message" value={message} onChange={setMessage} autoComplete="off" />
                  <InlineStack gap="400">
                    <TextField label="Hintergrundfarbe" name="bgColor" value={bgColor} onChange={setBgColor} autoComplete="off" />
                    <TextField label="Textfarbe" name="textColor" value={textColor} onChange={setTextColor} autoComplete="off" />
                  </InlineStack>
                  <InlineStack gap="400">
                    <Checkbox label="Startseite" name="showOnHome" checked={showOnHome} onChange={setShowOnHome} />
                    <Checkbox label="Produkt" name="showOnProduct" checked={showOnProduct} onChange={setShowOnProduct} />
                    <Checkbox label="Kategorie" name="showOnCollection" checked={showOnCollection} onChange={setShowOnCollection} />
                    <Checkbox label="Aktiv" name="active" checked={active} onChange={setActive} />
                  </InlineStack>
                  {actionData?.error && <Text tone="critical">{actionData.error}</Text>}
                  <Button submit loading={submitting} variant="primary">Speichern</Button>
                </FormLayout>
              </Form>
            </Box>
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card>
            <Box padding="400">
              <Text as="h3" variant="headingMd">Live Vorschau</Text>
              <Box paddingBlockStart="300">
                <div style={{ position: 'relative', minHeight: 60 }}>
                  <div style={{
                    position: 'sticky', top: 0, zIndex: 2147483647,
                    width: '100%', background: bgColor, color: textColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '8px 16px', borderRadius: 6
                  }}>
                    <span style={{ fontWeight: 600 }}>{message}</span>
                  </div>
                </div>
              </Box>
            </Box>
          </Card>
          <Card>
            <Box padding="400">
              <Text as="h3" variant="headingMd">Vorhandene Bars ({bars.length})</Text>
              <BlockStack gap="200">
                {bars.map((b) => (
                  <Inline key={b.id} gap="200">
                    <div style={{ inlineSize: 14, blockSize: 14, borderRadius: 4, background: b.bgColor }} />
                    <Text>{b.message}</Text>
                  </Inline>
                ))}
              </BlockStack>
            </Box>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
} 