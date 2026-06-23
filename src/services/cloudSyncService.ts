import { supabase } from "./supabaseService";

export type SyncTable =
  | "expenses"
  | "savings_goals"
  | "grocery_items"
  | "split_bills"
  | "recurring_expenses"
  | "achievements"
  | "user_settings";

type SyncableItem = {
  id: string;
};

export async function pushItemsToCloud<T extends SyncableItem>(
  table: SyncTable,
  userId: string,
  items: T[],
) {
  if (!supabase || items.length === 0) {
    return;
  }

  const rows = items.map((item) => ({
    id: item.id,
    user_id: userId,
    item_data: item,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from(table).upsert(rows, {
    onConflict: "id,user_id",
  });

  if (error) {
    throw error;
  }
}

export async function pullItemsFromCloud<T extends SyncableItem>(
  table: SyncTable,
  userId: string,
): Promise<T[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from(table)
    .select("item_data")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => row.item_data as T);
}

export async function pushSettingsToCloud<T>(
  userId: string,
  settings: T,
) {
  if (!supabase) {
    return;
  }

  const { error } = await supabase.from("user_settings").upsert(
    {
      user_id: userId,
      item_data: settings,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) {
    throw error;
  }
}

export async function pullSettingsFromCloud<T>(
  userId: string,
): Promise<T | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("user_settings")
    .select("item_data")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.item_data as T | null;
}
