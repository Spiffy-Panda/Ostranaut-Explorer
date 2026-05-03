// C# 9 records and init-only setters compile against System.Runtime.CompilerServices.IsExternalInit,
// which doesn't exist in netstandard2.1's BCL. Declaring it here lets modern C# work on the older surface.
#if !NET5_0_OR_GREATER
namespace System.Runtime.CompilerServices
{
    internal static class IsExternalInit { }
}
#endif
