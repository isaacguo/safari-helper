using Microsoft.Office.Interop.Word;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using Point = System.Drawing.Point;
using Word = Microsoft.Office.Interop.Word;

namespace WindowsFormsApp1
{
    public partial class Form1 : Form
    {


        Word.Application wordObj;
        Document activeDoc;

        bool started = false;
        public Form1()
        {
            InitializeComponent();
            this.button1.Text = "Run";
        }

        private void button1_Click(object sender, EventArgs e)
        {
            this.started = !this.started;
            if (!this.started)
            {
                this.button1.Text = "Run";
                this.label1.Text = "Stopped";
            }
            else
            {
                this.button1.Text = "Stop";
                this.label1.Text = "Running";


                try
                {
                    wordObj = (Word.Application)Marshal.GetActiveObject("Word.Application");
                }
                catch
                {
                    MessageBox.Show("Cannot find active word", "Error", MessageBoxButtons.OK);
                    this.started = false;
                    this.label1.Text = "Stopped";
                    this.button1.Text = "Run";
                    return;
                }

                this.activeDoc = wordObj.ActiveDocument;
            }

            ClipboardNotification.ClipboardUpdate += ClipboardNotification_ClipboardUpdate;
        }


        private void ClipboardNotification_ClipboardUpdate(object sender, EventArgs e)
        {
            if (Clipboard.GetText() == "loaded")
            {
                String[] coor = textBox1.Text.Split(',');
                clickButton(Int32.Parse(coor[0]), Int32.Parse(coor[1]));
            }
            else if (Clipboard.GetText() == "done!")
                return;
            else
            {
                PasteContents();
                Clipboard.SetText("done!");
                String[] coor = textBox2.Text.Split(',');
                clickButton(Int32.Parse(coor[0]), Int32.Parse(coor[1]));
            }

        }

        private void PasteContents()
        {
            try
            {
                //this.activeDoc.Select();
                this.activeDoc.Application.Selection.NoProofing = 1;
                //this.activeDoc.Application.Selection.MoveEnd(ref missing, ref missing);
                //this.activeDoc.Application.Selection.MoveRight(ref missing, ref missing, ref missing);
                this.activeDoc.Application.Options.SuggestSpellingCorrections = false;
                this.activeDoc.Application.Options.CheckGrammarAsYouType = false;
                this.activeDoc.Application.Options.CheckSpellingAsYouType = false;
                this.activeDoc.Application.Options.CheckGrammarWithSpelling = false;
                this.activeDoc.Application.DisplayAlerts =
                        Microsoft.Office.Interop.Word.WdAlertLevel.wdAlertsNone;

                //wApp.Selection.Paste();
                this.activeDoc.Application.Selection.PasteAndFormat(
                           Microsoft.Office.Interop.Word.WdRecoveryType.wdFormatOriginalFormatting);
            }
            catch
            {

            }
            finally
            {

                String returnHtmlText = null;
                if (Clipboard.ContainsText(TextDataFormat.Html))
                {
                    returnHtmlText = Clipboard.GetText(TextDataFormat.Html);
                    //Clipboard.Clear();
                }
            }
        }

        private String GetWindowTitle(IntPtr hWn)
        {
            object LParam = new object();
            int WParam = 0;
            StringBuilder title = new StringBuilder(1024);
            SendMessage(hWn, 0x000D, WParam, LParam);
            GetWindowText(hWn, title, title.Capacity);
            return title.ToString();

        }
        [DllImport("user32", CharSet = CharSet.Auto, SetLastError = true)]
        internal static extern int GetWindowText(IntPtr hWnd, [Out, MarshalAs(UnmanagedType.LPTStr)] StringBuilder lpString, int nMaxCount);
        [DllImport("User32.dll", EntryPoint = "SendMessage")]
        public static extern int SendMessage(IntPtr hWnd, int Msg, int wParam, object lParam);



        /// <summary>
        /// Struct representing a point.
        /// </summary>
        [StructLayout(LayoutKind.Sequential)]
        public struct POINT
        {
            public int X;
            public int Y;

            public static implicit operator Point(POINT point)
            {
                return new Point(point.X, point.Y);
            }
        }

        /// <summary>
        /// Retrieves the cursor's position, in screen coordinates.
        /// </summary>
        /// <see>See MSDN documentation for further information.</see>
        [DllImport("user32.dll")]
        public static extern bool GetCursorPos(out POINT lpPoint);

        public static Point GetCursorPosition()
        {
            POINT lpPoint;
            GetCursorPos(out lpPoint);
            //bool success = User32.GetCursorPos(out lpPoint);
            // if (!success)

            return lpPoint;
        }

        private void Form1_MouseMove(object sender, MouseEventArgs e)
        {
            Point point = Form1.GetCursorPosition();
            this.label3.Text = point.X.ToString() + ", " + point.Y.ToString();


        }




        [DllImport("user32.dll")]
        static extern void mouse_event(int dwFlags, int dx, int dy, int dwData, int dwExtraInfo);

        //This is a replacement for Cursor.Position in WinForms
        [System.Runtime.InteropServices.DllImport("user32.dll")]
        static extern bool SetCursorPos(int x, int y);

        private const int MOUSEEVENTF_MOVE = 0x0001;
        private const int MOUSEEVENTF_LEFTDOWN = 0x0002;
        private const int MOUSEEVENTF_LEFTUP = 0x0004;
        private const int MOUSEEVENTF_RIGHTDOWN = 0x0008;
        private const int MOUSEEVENTF_RIGHTUP = 0x0010;
        private const int MOUSEEVENTF_MIDDLEDOWN = 0x0020;
        private const int MOUSEEVENTF_MIDDLEUP = 0x0040;
        private const int MOUSEEVENTF_ABSOLUTE = 0x8000;
        private void Form1_Load(object sender, EventArgs e)
        {

        }

        private void clickButton(int x,int y)
        {
            Form1.SetCursorPos(x, y);
            Form1.LeftClick(x, y);
        }


        public static void MoveTo(int x, int y)
        {
            mouse_event(MOUSEEVENTF_ABSOLUTE | MOUSEEVENTF_MOVE, x, y, 0, 0);
        }
        public static void Move(int xDelta, int yDelta)
        {
            mouse_event(MOUSEEVENTF_MOVE, xDelta, yDelta, 0, 0);
        }

        public static void LeftClick()
        {
            mouse_event(MOUSEEVENTF_LEFTDOWN, System.Windows.Forms.Control.MousePosition.X, System.Windows.Forms.Control.MousePosition.Y, 0, 0);
            Thread.Sleep(100);
            mouse_event(MOUSEEVENTF_LEFTUP, System.Windows.Forms.Control.MousePosition.X, System.Windows.Forms.Control.MousePosition.Y, 0, 0);
        }

        public static void LeftClick(int x, int y)
        {
            mouse_event(MOUSEEVENTF_LEFTDOWN, x, y, 0, 0);
            Thread.Sleep(100);
            mouse_event(MOUSEEVENTF_LEFTUP, x, y, 0, 0);
        }

        private void Form1_Deactivate(object sender, EventArgs e)
        {

        }

        private void label2_Click(object sender, EventArgs e)
        {

        }
    }



}
