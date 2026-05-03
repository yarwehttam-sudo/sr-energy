"""
UEG Notion Database Build Script
=================================
Creates two databases under the UEG Operations parent page:
  1. UEG Reps - Stores rep profile and Clerk user ID for lead attribution
  2. UEG Doorstep Leads - Main lead pipeline DB with 48 columns
"""

import os
import sys
from dotenv import load_dotenv
from notion_client import Client

load_dotenv()
load_dotenv(".env.local", override=False)

NOTION_TOKEN = os.getenv("NOTION_TOKEN")
PARENT_PAGE_ID = os.getenv("PARENT_PAGE_ID")

if not NOTION_TOKEN or not PARENT_PAGE_ID:
    print("ERROR: Missing NOTION_TOKEN or PARENT_PAGE_ID in .env file")
    sys.exit(1)

notion = Client(auth=NOTION_TOKEN)


def test_connection():
    print("Testing Notion connection...")
    try:
        page = notion.pages.retrieve(page_id=PARENT_PAGE_ID)
        title = "Unknown"
        if page.get("properties", {}).get("title"):
            title_array = page["properties"]["title"].get("title", [])
            if title_array:
                title = title_array[0].get("plain_text", "Unknown")
        print(f"  Connected to page: {title}")
        return True
    except Exception as e:
        print(f"  ERROR: {e}")
        return False


def select_options(options, colors=None):
    default_colors = ["default", "gray", "brown", "orange", "yellow",
                      "green", "blue", "purple", "pink", "red"]
    result = []
    for i, opt in enumerate(options):
        color = (colors or {}).get(opt, default_colors[i % len(default_colors)])
        result.append({"name": opt, "color": color})
    return result


def create_ueg_reps_db():
    print("\nCreating UEG Reps database...")
    properties = {
        "Rep Name": {"title": {}},
        "Email": {"email": {}},
        "Phone": {"phone_number": {}},
        "Clerk User ID": {"rich_text": {}},
        "Status": {"select": {"options": select_options(
            ["Active", "Inactive", "Onboarding", "Terminated"],
            {"Active": "green", "Inactive": "gray",
             "Onboarding": "yellow", "Terminated": "red"})}},
        "Hire Date": {"date": {}},
        "Notes": {"rich_text": {}},
    }
    response = notion.databases.create(
        parent={"type": "page_id", "page_id": PARENT_PAGE_ID},
        title=[{"type": "text", "text": {"content": "UEG Reps"}}],
        icon={"type": "emoji", "emoji": "👥"},
        properties=properties,
    )
    db_id = response["id"]
    print(f"  UEG Reps DB created: {db_id}")
    return db_id


def create_ueg_doorstep_leads_db(reps_db_id):
    print("\nCreating UEG Doorstep Leads database...")
    properties = {
        "Lead Name": {"title": {}},
        "Phone": {"phone_number": {}},
        "Email": {"email": {}},
        "Full Address": {"rich_text": {}},
        "City": {"rich_text": {}},
        "State": {"select": {"options": select_options(
            ["AZ", "CA", "CO", "HI", "ID", "NJ", "NY", "TX", "UT"])}},
        "Zip Code": {"rich_text": {}},
        "Rep": {"relation": {"database_id": reps_db_id, "single_property": {}}},
        "Date Pitched": {"date": {}},
        "Pitch Outcome": {"select": {"options": select_options(
            ["Booked appointment", "Captured email only", "Signed at door",
             "Not home", "Not interested", "Disqualified",
             "Callback requested", "Spouse needed"],
            {"Signed at door": "green", "Booked appointment": "blue",
             "Captured email only": "yellow", "Callback requested": "yellow",
             "Spouse needed": "orange", "Not home": "gray",
             "Not interested": "red", "Disqualified": "red"})}},
        "Utility Company": {"select": {"options": select_options([
            "Rocky Mountain Power", "APS / Arizona Public Service",
            "SRP / Salt River Project", "TEP / Tucson Electric Power",
            "PG&E", "SCE / Southern California Edison",
            "SDG&E / San Diego Gas & Electric", "Xcel Energy",
            "Hawaiian Electric", "PSEG",
            "JCP&L / Jersey Central Power & Light", "Con Edison",
            "National Grid", "Oncor", "CenterPoint Energy",
            "TXU Energy", "Reliant Energy", "Other"])}},
        "Avg Monthly Bill": {"number": {"format": "dollar"}},
        "Annual kWh Usage": {"number": {"format": "number"}},
        "Home Ownership": {"select": {"options": select_options(
            ["Owns", "Rents", "Unknown"],
            {"Owns": "green", "Rents": "red", "Unknown": "gray"})}},
        "Visible Roof Issues": {"select": {"options": select_options(
            ["None", "Missing shingles", "Leak history",
             "Recent repairs", "Customer unsure"],
            {"None": "green", "Missing shingles": "red",
             "Leak history": "red", "Recent repairs": "yellow",
             "Customer unsure": "gray"})}},
        "Lead Status": {"select": {"options": select_options([
            "Pitched", "Estimate Shown", "Site Survey Captured",
            "Accurate Proposal Generated", "Proposal Sent",
            "Appointment Booked", "Contract Signed",
            "Install Scheduled", "Installed", "Active",
            "Lost - Not Interested", "Lost - Disqualified",
            "Lost - No Response"], {
            "Pitched": "gray", "Estimate Shown": "blue",
            "Site Survey Captured": "blue",
            "Accurate Proposal Generated": "purple",
            "Proposal Sent": "purple", "Appointment Booked": "yellow",
            "Contract Signed": "orange", "Install Scheduled": "orange",
            "Installed": "green", "Active": "green",
            "Lost - Not Interested": "red", "Lost - Disqualified": "red",
            "Lost - No Response": "red"})}},
        "Next Action Type": {"select": {"options": select_options([
            "Call back", "Send proposal", "Schedule walkthrough",
            "Submit to ops for review", "Follow up on signed contract",
            "Confirm install date", "No action needed"],
            {"No action needed": "gray"})}},
        "Next Action Due Date": {"date": {}},
        "Appointment Date/Time": {"date": {}},
        "Notes": {"rich_text": {}},
        "Estimate Min Savings": {"number": {"format": "dollar"}},
        "Estimate Max Savings": {"number": {"format": "dollar"}},
        "Proposed System Size kW": {"number": {"format": "number_with_commas"}},
        "Battery Included": {"select": {"options": select_options(
            ["None", "1 Battery", "2 Batteries", "3+ Batteries"])}},
        "Panel Direction": {"select": {"options": select_options([
            "100% South", "75% South", "50% South", "25% South",
            "Mixed", "East-West", "North-facing", "Other"])}},
        "Offset Target %": {"number": {"format": "percent"}},
        "Monthly UEG Payment": {"number": {"format": "dollar"}},
        "Estimated Monthly Savings": {"number": {"format": "dollar"}},
        "Accurate Proposal Generated": {"checkbox": {}},
        "Proposal PDF": {"files": {}},
        "Proposal Sent Date": {"date": {}},
        "Photo - Meter/Main from 10ft": {"files": {}},
        "Photo - Meter Bubble": {"files": {}},
        "Photo - Main Panel Circuit Breakers": {"files": {}},
        "Photo - Main Panel Sticker": {"files": {}},
        "Photo - Attic Rafters": {"files": {}},
        "Photo - Front of House Roof": {"files": {}},
        "Photo - Back of House Roof": {"files": {}},
        "Photo - Sides of House Roof": {"files": {}},
        "Photo - Utility Bill": {"files": {}},
        "Photo - Roof Damage Close-up": {"files": {}},
        "Site Survey Complete": {"checkbox": {}},
        "MPU Required": {"select": {"options": select_options(
            ["Unknown", "Yes", "No", "Borderline - flag for review"],
            {"Unknown": "gray", "Yes": "red", "No": "green",
             "Borderline - flag for review": "yellow"})}},
        "MPU Estimated Cost": {"number": {"format": "dollar"}},
        "Ops Review Status": {"select": {"options": select_options(
            ["Pending Review", "Approved", "Requires Re-survey", "Rejected"],
            {"Pending Review": "yellow", "Approved": "green",
             "Requires Re-survey": "orange", "Rejected": "red"})}},
        "Ops Review Notes": {"rich_text": {}},
        "Created Date": {"created_time": {}},
        "Last Updated": {"last_edited_time": {}},
    }
    response = notion.databases.create(
        parent={"type": "page_id", "page_id": PARENT_PAGE_ID},
        title=[{"type": "text", "text": {"content": "UEG Doorstep Leads"}}],
        icon={"type": "emoji", "emoji": "🏠"},
        properties=properties,
    )
    db_id = response["id"]
    print(f"  UEG Doorstep Leads DB created: {db_id}")
    return db_id


def main():
    print("=" * 60)
    print("UEG Notion Database Build Script")
    print("=" * 60)
    if not test_connection():
        sys.exit(1)
    try:
        reps_db_id = create_ueg_reps_db()
        leads_db_id = create_ueg_doorstep_leads_db(reps_db_id)
        print("\n" + "=" * 60)
        print("BUILD COMPLETE")
        print("=" * 60)
        print(f"\nUEG Reps DB ID: {reps_db_id}")
        print(f"UEG Doorstep Leads DB ID: {leads_db_id}")
        return reps_db_id, leads_db_id
    except Exception as e:
        print(f"\nBUILD FAILED: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
