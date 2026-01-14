import {
  Bold,
  Italic,
  Strikethrough,
  Underline,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Code,
  Link as LinkIcon,
} from 'lucide-react';

interface EditorToolbarProps {
  onCommand: (command: string, value?: string) => void;
  theme: 'light' | 'dark';
}

const EditorToolbar = ({ onCommand, theme }: EditorToolbarProps) => {
  const tools = [
    { icon: <Bold size={18} />, command: 'bold', label: 'Bold' },
    { icon: <Italic size={18} />, command: 'italic', label: 'Italic' },
    { icon: <Strikethrough size={18} />, command: 'strikeThrough', label: 'Strikethrough' },
    { icon: <Underline size={18} />, command: 'underline', label: 'Underline' },
    { divider: true },
    { icon: <List size={18} />, command: 'insertUnorderedList', label: 'Bullet List' },
    { icon: <ListOrdered size={18} />, command: 'insertOrderedList', label: 'Numbered List' },
    { divider: true },
    { icon: <Indent size={18} />, command: 'indent', label: 'Indent' },
    { icon: <Outdent size={18} />, command: 'outdent', label: 'Outdent' },
    { divider: true },
    { icon: <Code size={18} />, command: 'formatBlock', value: 'pre', label: 'Code Block' },
    {
      icon: <LinkIcon size={18} />,
      command: 'createLink',
      label: 'Insert Link',
      customHandler: () => {
        const url = prompt('Enter URL:');
        if (url) onCommand('createLink', url);
      },
    },
  ];

  return (
    <div className={`w-16 border-r flex flex-col items-center py-4 gap-2 ${
      theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-gray-700 bg-gray-800'
    }`}>
      {tools.map((tool, index) => {
        if ('divider' in tool) {
          return (
            <div
              key={`divider-${index}`}
              className={`w-8 h-px my-1 ${
                theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'
              }`}
            />
          );
        }

        return (
          <button
            key={tool.command}
            onClick={() => {
              if ('customHandler' in tool && tool.customHandler) {
                tool.customHandler();
              } else {
                onCommand(tool.command, 'value' in tool ? tool.value : undefined);
              }
            }}
            title={tool.label}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'light'
                ? 'hover:bg-gray-200 text-gray-700'
                : 'hover:bg-gray-700 text-gray-300'
            }`}
          >
            {tool.icon}
          </button>
        );
      })}

      {/* Export dropdown placeholder for V2 */}
      <div className="mt-auto">
        <div className={`text-xs px-2 py-1 rounded ${
          theme === 'light' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {/* V2: Export options */}
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;
