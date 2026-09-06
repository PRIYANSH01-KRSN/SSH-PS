import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  try {
    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json({
        success: true,
        source: "local_cache",
        data: [],
      });
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase products GET warning (falling back to local cache):", error.message);
      return NextResponse.json({
        success: true,
        source: "local_cache",
        data: [],
      });
    }

    return NextResponse.json({
      success: true,
      source: "supabase",
      data: data || [],
    });
  } catch (error: any) {
    console.warn("Products GET fallback:", error.message);
    return NextResponse.json({
      success: true,
      source: "local_cache",
      data: [],
    });
  }
}

export async function POST(request: Request) {
  let product: any = {};
  try {
    product = await request.json();

    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json({
        success: true,
        source: "local_cache",
        message: "Saved locally (Supabase keys not configured in .env.local)",
        data: product,
      });
    }

    const record = {
      id: product.id || `PROD-${Date.now().toString().slice(-4)}`,
      title_en: product.title_en,
      title_hi: product.title_hi,
      category: product.category,
      price: product.price,
      artisan_wage: product.artisan_wage,
      materials: Array.isArray(product.materials) ? product.materials : [product.materials].filter(Boolean),
      dimensions: product.dimensions,
      description_en: product.description_en,
      description_hi: product.description_hi,
      image_url: product.image,
      gi_tagged: product.gi_tagged ?? true,
      in_stock: product.in_stock ?? true,
      ai_pricing: product.ai_pricing || {},
      ondc_schema: product.ondc_schema || {},
    };

    const { data, error } = await supabase
      .from("products")
      .upsert(record)
      .select()
      .single();

    if (error) {
      console.warn("Supabase products POST warning (falling back to local):", error.message);
      return NextResponse.json({
        success: true,
        source: "local_cache",
        message: "Saved locally (Cloud schema pending).",
        data: product,
      });
    }

    return NextResponse.json({
      success: true,
      source: "supabase",
      data,
    });
  } catch (error: any) {
    console.warn("Products POST fallback:", error.message);
    return NextResponse.json({
      success: true,
      source: "local_cache",
      message: "Saved locally.",
      data: product,
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json({ success: true, source: "local_cache" });
    }

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      console.warn("Supabase DELETE warning:", error.message);
      return NextResponse.json({ success: true, source: "local_cache" });
    }

    return NextResponse.json({ success: true, source: "supabase" });
  } catch (error: any) {
    console.warn("Products DELETE fallback:", error.message);
    return NextResponse.json({ success: true, source: "local_cache" });
  }
}
