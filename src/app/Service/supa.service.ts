import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/enviornment';

@Injectable({
  providedIn: 'root',
})
export class SupaService {
  public supabaseClient: SupabaseClient;
  constructor() {
    this.supabaseClient = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  signUp(email: string, password: string) {
    return this.supabaseClient.auth.signUp({ email, password });
  }
  signIn(email: string, password: string) {
    return this.supabaseClient.auth.signInWithPassword({ email, password });
  }

  signOut() {
    return this.supabaseClient.auth.signOut();
  }
}
